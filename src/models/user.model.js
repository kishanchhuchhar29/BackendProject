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
    return jwt.sign({
        _id:this._id,
        username:this.username,
        email:this.email,
        fullName:this.fullName
    },
    process.env.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }

    )

}
userSchama.methods.generateAccessToken=function(){
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