import { Tweet } from "../models/tweet.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

    const {user} = req;
    const {content} = req.body
    if(!content?.trim()) {
        throw new ApiError(400, "Content is required")
    }

    const tweet = await Tweet.create({
        content,
        owner: user.id
    })
    if(!tweet){
        throw new ApiError(500, "Error while creating tweet")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, tweet, "Tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    const {userId} = req.params

    let tweets;
    try {
        tweets = await Tweet.find({
            owner: userId
        })
    } catch (error) {
        throw new ApiError(400, "Invalid User ID")
    }

    if (!tweets.length) {
        throw new ApiError(400, "Tweets not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, tweets, "Tweets fetched successfully"))

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet

    //check if content is there or not
    const {content} =req.body
    if(!content?.trim()){
        throw new ApiError(400, "Content is required")
    }

    //To find & update tweet
    const {tweetId} = req.params
    const {user} = req
    let tweet;
    try {
        tweet = await Tweet.findOneAndUpdate({
            _id: tweetId,
            owner: user._id
        },
        {
            $set: {
                content
            }
        },
        {
            new: true
        }
    )
    } catch (error) {
        throw new ApiError(400, "Invalid Tweet ID")
    }
    if(!tweet){
        throw new ApiError(400,tweet, "Tweet not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        tweet,
        "Tweet updated successfully"
        )
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    const {tweetId} = req.params
    const{user} = req
    let deletedTweet;
    try {
        deleteTweet = await Tweet.findOneAndDelete({
            _id: tweetId,
            owner: user._id
        })
    } catch (error) {
        throw new ApiError(400, "Invalid Tweet ID")
    }
    if (!deletedTweet) {
        throw new ApiError(400, "Tweet not found")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, deletedTweet, "Tweet deleted successfully"))

})

export {
    createTweet, deleteTweet, getUserTweets,
    updateTweet
}
