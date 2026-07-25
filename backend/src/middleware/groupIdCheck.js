import mongoose from "mongoose";
export function groupIdValidity(req,res,next){
    const gId = req.params.groupId;
    if (mongoose.Types.ObjectId.isValid(gId)){
        next();
    }
    else {
        console.log("Invalid groupId was provided!");
        res.status(400).send("Invalid groupId was provided!");
    }
}