import { User } from "../models/user.model.js";
import { ApiError } from "../utails/apiError.js";
import { asyncHandler } from "../utails/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT=asyncHandler(async (req,_,next)=>{
  try {
    const tokenFromCookie = req.cookies?.accessToken;
    const tokenFromHeader = req.header("Authorization")?.replace("Bearer ", "");

  //  console.log("Token from Cookie:", tokenFromCookie);
    //console.log("Token from Header:", tokenFromHeader);

    const token = tokenFromCookie || tokenFromHeader;
      if(!token)throw new ApiError(401,"unathoraizaccess");
      const decodeToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
      const user=await User.findById(decodeToken?._id).select("-password -refreshToken")
       if(!user)throw new ApiError(401,"invalid acccess")
       req.user=user;
      next();
  } catch (error) {
    throw new ApiError(401,error?.message || "invalid authmiddelware")
    
  }
})