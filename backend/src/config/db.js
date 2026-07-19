import mongoose from "mongoose";
export async function connectToDatabase(){
    try{
        console.log("Connection in progress...");
        const conn= await mongoose.connect(process.env.MONGO_URI);
        console.log("Connection done...");
    }
    catch(err){
        console.log("An error occured in connecting to database...");
        console.log(err);
        process.exit(1);
    }
}
