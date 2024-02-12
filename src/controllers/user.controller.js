import { asyncHandler } from "../utails/asyncHandler.js";
import {ApiError} from "../utails/apiError.js"
import {User} from "../models/user.model.js"
import {uploadoncloudinary} from "../utails/cloudinary.js"
import {ApiResponse} from "../utails/apiRespond.js"
import  * as jwt from "jsonwebtoken"
const generateAccessandrefreshToken=async(userId)=>{
    try {
       
        const user=await User.findOne(userId);
        const accessToken=user.generateAccessToken()
        const RefreshToken=user.generateRefreshToken()
        console.log("kishan", accessToken , " ", RefreshToken)
        user.refreshToken=RefreshToken
        await user.save({validateBeforeSave:false})
        return {accessToken,RefreshToken};
        
    } catch (error) {
         throw new ApiError(500,"somthing want whorge while ganrate access and refresh token")
    }
}
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
     const exgistuser=await User.findOne({
        $or:[{ username },{ email }]
})
     if(exgistuser){
        throw new ApiError(409,"User allready Exists")
     } 
     console.log(email);
     const avatarImagelocalpath= req.files?.avatar?.[0]?.path;
    // const coverImagelocalpath= req.files?.coverImage[0]?.path;
     console.log("cbjb",avatarImagelocalpath);
     let coverImageLocalPath;
     if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
         coverImageLocalPath = req.files?.coverImage?.[0]?.path;
     }
     if(!avatarImagelocalpath)throw new ApiError(400,"Avatar file is required")
     const avatar=await uploadoncloudinary(avatarImagelocalpath);

    
     const coverImage=await uploadoncloudinary(coverImageLocalPath);
     
     if(!avatar) throw new ApiError(400,"Avatar file is required")
     const user= await User.create({
         fullName,
         avatar:avatar.url,
         coverImage : coverImage?.url||"",
         email,
         password,
         username:username.toLowerCase()
    })
    const createuser=await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createuser){
        throw new ApiError(500,"somthing want wonge while register user")
    }
    
  return res.status(201).json(
        new ApiResponse(200,createuser,"user register Succesfully")
  )
})
const loginuser=asyncHandler(async (req,res)=>{
  const {username,email,password}=req.body
  if(!username & !email){
    throw new ApiError(400,"email or user name required")
  }
  const user=await User.findOne({
    $or: [{username},{email}]
  }
  )
  if(!user){
    throw new ApiError(404,"User Not Founn")
  }
  const isPasswordValid= await user.isPasswordCorrect(password);
  if(!isPasswordValid){
    console.log("hsajh")
    throw new ApiError(404,"password is inValid")
  }
  const {accessToken,RefreshToken}= await generateAccessandrefreshToken(user._id);
  const loginuser=await User.findById(user._id).select("-password -refreshToken");
  const options ={
    httpOnly:true,
    secure:true
  }
  return res.status(200)
  .cookie("access Token",accessToken,options)
  .cookie("Refresh Token",RefreshToken,options)
  .json(
    new ApiResponse(
        200,{
            user:loginuser,accessToken,RefreshToken
        },
        "user log in succesfully"
    )
  )
})
const logoutuser=asyncHandler(async (req,res)=>{
  console.log("djs")
    await User.findByIdAndUpdate(req.user._id,{
        $set:{
            refreshToken:undefined
        }
    },
        {
            new:true
        })
        const options ={
            httpOnly:true,
            secure:true
          }
          return res.status(200)
          .clearCookie("accessToken",options)
          .clearCookie("refreshToken",options)
          .json(new ApiResponse(200,{},"user logout"))

})
const refreshAccessToken=asyncHandler(async(req,res)=>{
 try {
   const incoimgrefreshToken=req.cookies.refreshToken ||req.body.refreshToken
   if(incoimgrefreshToken)throw new ApiError(401,"unauthaisrequest");
   const decodeToken=jwt.verify(incoimgrefreshToken,process.env.REFRESH_TOKEN_SECRET)
   const user= await User.findById(decodeToken?._id);
   if(!user)throw new ApiError(401,"invalid Refresh Token");
   if(incoimgrefreshToken!==user.refreshToken)throw new ApiError(401,"refresh Token is expire or used")
 
   const option={
     httpOnly:true,
     secure:true
   }
   const {accessToken,newrefreshToken}=await generateAccessandrefreshToken(user._id);
 
   return res.status(200)
   .cookie("accessToken",accessToken,option)
   .cookie("refreshToken",newrefreshToken,option)
   .json(
     new ApiResponse(
       200,
       {accessToken,refreshToken:newrefreshToken},
       "Access Token refresh"
 
     )
   )
 } catch (error) {
     throw new ApiError(401,error?.message||"invalid Refresh Token");
 }

})
export {registeruser,
   loginuser,
logoutuser,
refreshAccessToken};