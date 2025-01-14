import mongoose,{isValidObjectId} from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import {Video} from "../models/video.model.js"
import {ApiResponse}from "../utils/ApiResponse.js"

const getAllVideos=asyncHandler(async (req,res) => { //filtering finctionality

    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

    const pipeline=[]

    if(query){
        pipeline.push({
            $match:{
                $or:[
                    {title: {$regex: query, $options: "i"}},
                    {description: {$regex: query, $options: "i"}},
                ]
            },

        })
    }
    if (userId) {
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid userId");
        }

        pipeline.push({
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        });
    }

     // fetch videos only that are set isPublished as true
     pipeline.push({ $match: { isPublished: true } });



      //sortBy can be views, createdAt, duration
    if (sortBy && sortType) {
        pipeline.push({
            $sort: {
                [sortBy]: sortType === "asc" ? 1 : -1
            }
        });
    } else {
        pipeline.push({ $sort: { createdAt: -1 } });
    }

    pipeline.push(
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        // //After $lookup, ownerDetails is an array. $unwind converts this array into a single object.
        {   
        $unwind: "$ownerDetails"
        }
    );

    //To show random content when the user hasn't specified pagination or filtering criteria.
    if (!page && !limit) {
        pipeline.push({ $sample: { size: 10 } });
    }


    
    const videoAggregate = Video.aggregate(pipeline);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    };

    const video = await Video.aggregatePaginate(videoAggregate, options);

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Videos fetched successfully"));
    
})

export {
    getAllVideos,
}