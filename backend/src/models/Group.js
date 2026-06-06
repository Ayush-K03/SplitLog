import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
    groupName:{type:String,required:true},
    createdBy:{type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    members:[{type:mongoose.Schema.Types.ObjectId, ref: 'User'}],
    inviteCode:{type:String,required:true,unique:true}
},{timestamps:true})

export const Groups = mongoose.model("Groups",groupSchema);