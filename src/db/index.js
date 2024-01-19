import { DB_NAME } from "../constants.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({
    path:'./.env'
})

const connectDB=async ()=>{
    try {
       const connectiondb= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
       console.log(`mongobd connect succefully || DB_HOST ${connectiondb.connection.host}`);

        
    } catch (error) {
        console.log("error : ",error);
        process.exit(1) ;
    }
}
export default connectDB;