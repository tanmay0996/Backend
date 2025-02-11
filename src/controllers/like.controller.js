import mongoose from "mongoose";
import {Like} from "../models/like.model.js"
// import {Comment} from "../models/comment.model.js"
import { isValidObjectId } from "mongoose";
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"

const toggleVideoLike=asyncHandler(async (req,res) => {
    const {videoId}=req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid VideoId")

        
    }
    const likeAlready= await Like.findOne({
        video:videoId,
        likedBy:req.user?._id,  
    })

    if(likeAlready){
        await Like.findByIdAndUpdate(likeAlready?._id)
        return res
        .status(200)
        .json(
            new ApiResponse(200,{isLiked:false})
        )
    }
    await Like.create({

        video:videoId,
        likedBy:req.user?._id,
    }
        
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,{isLiked:true})
    )
    
    
})

const toggleCommentLike=asyncHandler(async (req,res) => {
    const {commentId}=req.params;

    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid Comment ID")
    }

    const likeAlready=await Like.findOne({
        comment:commentId,
        likedBy:req.user?._id,
        
    })
    
    if(likeAlready){
       await  Like.findByIdAndDelete(likeAlready?._id)
       return res
       .status(200)
       .json(
        new ApiResponse(200,{isLiked:false})
       )
    }

    await Like.create({
        comment:commentId,
        likedBy:req.user?._id,
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200,{isLiked:true})
    )
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetId");
    }


    const likedAlready = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user?._id,
    });

    if (likedAlready) {
        await Like.findByIdAndDelete(likedAlready?._id);

        return res
            .status(200)
            .json(new ApiResponse(200, { tweetId, isLiked: false }));
    }

    await Like.create({
        tweet: tweetId,
        likedBy: req.user?._id,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: true }));
});






export{
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike
}