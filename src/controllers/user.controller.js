import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req,res)=>{
    const {fullName,email,username,password}=req.body
    console.log("email:",email);
    // console.log("req.body:",req.body);
    // console.log("req.files:",req.files); 

    // if(fullName===""){
    //     throw new ApiError(400,"fullName is required") 
    // }

    if(
        [fullName,email,username,password].some((field)=>
        field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required")
    }

    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409,"User with same username or email already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }

    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar file upload failed")
    }

    const user = await User.create({
        fullName,
        email,
        username:username.toLowerCase(),
        password,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"User creation failed")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registred succesfully")
    )



})



export {registerUser}