//require('dotenv').config()

import dotenv from"dotenv"
import connectDB from "./db/index.js";
 dotenv.config({
     path: '/.env'
 })
connectDB();

/*
import express from"express"
const app=express();
(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error",(err)=>{
             console.log("error: ",err);
             throw err;
        })
        app.listen(process.env.PORT,()=>{
            console.log(`your application listion on port number ${process.env.PORT}`);
        })
    } catch (error) {
        console.log(error);
        throw error;
    }
})() */
