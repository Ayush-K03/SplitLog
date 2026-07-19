import mongoose from "mongoose";

const settlementSchema = new mongoose.Schema({
    groupId:{type:mongoose.Schema.Types.ObjectId, ref:"Groups", required:true},
    from : {type:mongoose.Schema.Types.ObjectId, ref:"User"},
    to : {type:mongoose.Schema.Types.ObjectId, ref:"User"},
    amount : {type : Number, required: true},
    status: {type: String},
    settledAt : {type : Date, default:Date.now}
},{timestamps:true})

export const SettlementData = mongoose.model("SettlementData",settlementSchema);