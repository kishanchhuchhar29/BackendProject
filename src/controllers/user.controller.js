import { asyncHandler } from "../utails/asyncHandler.js";

const registeruser= asyncHandler(async (req,res)=>{
    res.status(200).json({
        message:"kishan"
    })
})
export {registeruser};