import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler( async (req, res) => {
    //Step1: get user details from frontend
    //2: validation - not empty
    //3: check if user already exists : username or email
    //4: check for images , check for avatar
    //5: upload them to cloudinary, avatar
    //6: create user object - create entry in db
    //7: remove password & refresh token field from response
    //8: check for user creation
    //9: return response

    //Step 1:
    const {fullName, email, username, password} = req.body
    console.log("email: ", email);

    //Step 2: advanced if condition for checking all values at once
    if (
        [fullName,email,username,password].some((field)=>
        field?.trim() === "")
    ){
        throw new ApiError(400, "All fields is required")
    }

    //Step3:
    const existedUser = User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exits")
    }

    //Step 4:
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    //Step 5:
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    //Step 6:
    const user = awaitUser.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    //Step 7:
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    //Step: 8
    if (createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    //Step 9:
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
} )



export { registerUser };
