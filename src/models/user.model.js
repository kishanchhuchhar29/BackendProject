import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcryt from "bcrypt";
const userSchama=new Schema({
    username:{
        type:String,
        requied:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true

    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowecase: true,
        trim: true, 
    },
    fullName: {
        type: String,
        required: true,
        trim: true, 
        index: true
    },
    avatar: {
        type: String, // cloudinary url
        required: true,
    },
    coverImage: {
        type: String, // cloudinary url
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken: {
        type: String
    }

},{timestamps:true})
userSchama.pre("save",async function(next){
    //if any fild change then run this function 
    if(!this.isModified("password"))return next();
    this.password= await bcryt.hash(this.password,10);
    next();
})
userSchama.methods.isPasswordCorrect=async function(password){
    return await bcryt.compare(password,this.password);
}
userSchama.methods.generateAccessToken=function(){
    // what is defferens between Access Token and Refresh-Token
    // Acess Token is sort time Live (after 15 min or 20min Token is expire);
    //Refresh-Token is Long time Live it is presant in Server if Acess Token is expire
    //then Front-End Devlopper hit the end point and refresh Access-Token 
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }

    )

}
userSchama.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )


}
export const User=mongoose.model("User",userSchama);