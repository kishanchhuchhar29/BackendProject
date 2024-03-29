//require('dotenv').config()

import dotenv from"dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";
 dotenv.config({
     path: '/.env'
 })
connectDB().then(()=>{
    app.on("error",(err)=>{
        console.log("connecttion error : ",err);
        throw err;
    })
 app.listen(process.env.PORT || 8000,()=>{
    console.log(`server is runing in port number${process.env.PORT} `);
 })
});

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
