import { asyncHandler } from "../utails/asyncHandler.js";
import {ApiError} from "../utails/apiError.js"
import {User} from "../models/user.model.js"
import {uploadoncloudinary} from "../utails/cloudinary.js"
import {ApiResponse} from "../utails/apiRespond.js"
const registeruser= asyncHandler(async (req,res)=>{
    //get data from frontend
    //validation->empty
    // user allready exitst or not :username ,email
    //check for image and check for avatar
    //upload them into clouadnory
    //create object-DB
    //remove password and reffresh token
    //check for user create
    //return respond
    const {fullName,email,username,password}=req.body
    console.log("email : ",email);
    if(
        [fullName,email,username,password].some((fild)=>fild?.trim()==="")
    ){
        throw new ApiError(400,"all fild are required")
    }
     const exgistuser=User.findOne(
        $or=[{ username },{ email }]
     )
     if(exgistuser){
        throw new ApiError(409,"User allready Exists")
     }
     const avatarImagelocalpath=req.filds?.avatar[0]?.path;
     const coverImagelocalpath= req.filds?.coverImage[0]?.path;
     if(!avatarImagelocalpath)throw new ApiError(400,"Avatar file is required")
     const avatar=await uploadoncloudinary(avatarImagelocalpath)
     const coverImage=await uploadoncloudinary(coverImagelocalpath);
     if(!avatar) throw new ApiError(400,"Avatar file is required")
     const user= await User.create({
         fullName,
         avatar:avatar.url,
         coverImage : coverImage?.url||"",
         email,
         password,
         username:username.toLowerCase()
    })
    const createuser=User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createuser){
        throw ApiError(500,"somthing want wonge while register user")
    }
    
  return res.status(201).json(
        new ApiResponse(200,createuser,"user register Succesfully")
  )
})
export {registeruser};