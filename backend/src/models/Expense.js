import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    description: {type:String, required:true},
    amount : {type: Number, required:true},
    paidBy : {type: mongoose.Schema.Types.ObjectId,ref:"User"},
    splitAmong: [{type: mongoose.Schema.Types.ObjectId , ref: "User"}],
    groupId: {type:mongoose.Schema.Types.ObjectId, ref:"Groups"}
},{timestamps: true})

export const Expense = mongoose.model("Expense",expenseSchema);
