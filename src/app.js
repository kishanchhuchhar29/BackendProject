import express, { json } from "express";
import cors from "cors";
import cookieparser from 'cookie-parser';
const app=express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
//which Type of data coming 
app.use(express.json({limit:"16kb"}))
//how to data hendel with api if i search kishan on google how to handle this data 
app.use(express.urlencoded({extended:true,limit:"16kb"}));
// it use for everone access data such as image ,video 
app.use(express.static("public"));
// store cookie of website 
app.use(cookieparser());

import userRouter from './routes/user.route.js';
app.use('/api/v1/users',userRouter);
console.log("object")
export {app};