import { DB_NAME } from "../constants.js";
import mongoose from "mongoose";


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