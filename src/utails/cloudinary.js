import {v2 as cloudinary} from "cloudinary";
import fs from "fs";         
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadoncloudinary= async(localpath)=>{
    try {
      if(!localpath)return null;
     const respond=await cloudinary.uploader.upload(localpath,{
        resource_type:"auto"
     })
     //file upload succecfully
     console.log("file upload succecfully",respond.url);
     return respond;   
    } catch (error) {
        fs.unlinkSync(localpath) // remove the tempory filed file
        
    }
    
}
export {uploadoncloudinary};