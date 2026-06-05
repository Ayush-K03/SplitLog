import mongoose from "mongoose";
export async function connectToDatabase(){
    try{
        const conn= await mongoose.connect("mongodb://localhost:27017/splitlog_db");
        console.log("Connection in progress...");
        console.log("Connection done...");
    }
    catch(err){
        console.log("An error occured in connecting to database...");
        console.log(err);
        process.exit(1);
    }
}
