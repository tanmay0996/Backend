import mongoose,{isValidObjectId} from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import {Video} from "../models/video.model.js"
import {ApiResponse}from "../utils/ApiResponse.js"
import {
    uploadOnCloudinary,
    deleteOnCloudinary
} from "../utils/cloudinary.js";

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

const publishAVideo= asyncHandler(async (req,res) => {
    //for this functionality 4 files are required
    /*1.controller(jismay likh rahe ho)
      2.multer.middleware
      3.cloudinary.js
      4.video.route.js*/

    const {title,description}=req.body
    if([title,description].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"All fields are required")
    }

    const videoFileLocalPath = req.files?.videoFile[0].path;  //videoFile route se aya
    const thumbnailLocalPath = req.files?.thumbnail[0].path;

    if (!videoFileLocalPath) {
        throw new ApiError(400, "videoFileLocalPath is required");
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "thumbnailLocalPath is required");
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoFile) {
        throw new ApiError(400, "Video file not found");
    }

    if (!thumbnail) {
        throw new ApiError(400, "Thumbnail not found");
    }

    const video= await Video.create({
        title,
        description,
        duration:videoFile.duration,
        videoFile:{
            url:videoFile.url,         // cloudinary response obj se aa raha hai
            public_id: videoFile.public_id // cloudinary response obj se aa raha hai
        },
        thumbnail:{
            url:thumbnail.url,
            public_id:thumbnail.public_id
        },
        owner:req.user?._id,
        isPublished:false

    })

    const videoUpload=await Video.findById(video._id);

    if(!videoUpload){
        throw new ApiError(500,"Video is not uploaded")
    }
    return res
        .status(200)
        .json(new ApiResponse(200,video,"video uploaded successfully"))

})

export {
    getAllVideos,
    publishAVideo
}