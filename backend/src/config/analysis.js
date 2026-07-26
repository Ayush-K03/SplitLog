import {Types} from "mongoose";
import {Expense} from "../models/Expense.js";
import { Groups } from "../models/Group.js";
export async function getAnalysisData (req,res){
    try{
        const {groupId,startDate,endDate} = req.body;

        const userGroups = await Groups.find({ members: req.user.userId }).select('_id');
        const userGroupIds = userGroups.map(g => g._id);

        const startingDate = new Date (startDate);
        const endingDate = new Date (endDate);

        let start = new Date(startingDate);
        let end = new Date(endingDate);
        
        const matchQuery = {createdAt: { $gte: start, $lte: end }};

        if (groupId) {
            if (!userGroupIds.some(id => id.toString() === groupId)) {
                return res.status(403).json({msg: "Unauthorized access to group analytics"});
            }
            matchQuery.groupId = new Types.ObjectId(groupId);
        }
        else matchQuery.groupId = { $in: userGroupIds };

        const commonStage = { $match: matchQuery };

        const [ totalExpenseResult,expenseCountResult,spendData,trendData,categoryData] = 
        await Promise.all(
            [
                Expense.aggregate([commonStage,  {$group: {_id: null,totalExpense: { $sum: "$amount" }}}]),
                Expense.aggregate([commonStage,  {$count: "totalExpenses" }]),
                Expense.aggregate([commonStage, {$group: {_id: "$paidBy",totalSpend: {$sum: "$amount"}}},{$lookup: {from: "users", localField: "_id", foreignField: "_id", as: "user"}},{$unwind: "$user"}, {$project: {_id: 0, user: {$concat: ["$user.firstName", " ", "$user.lastName"]}, totalSpend: 1}}, {$sort: {totalSpend: -1}}]) ,
                Expense.aggregate([commonStage, {$group: {_id: {$dateToString: {format: "%Y-%m-%d",date: "$createdAt"}},totalExpense: {$sum: "$amount"}}}, {$project: {_id: 0,date: "$_id",totalExpense: 1}}, {$sort: {date: 1}}]) ,
                Expense.aggregate([ commonStage,{$group : {_id: "$category" , totalSum :{$sum : "$amount"}}}, {$project:{_id:0,category:"$_id",totalExpense:"$totalSum"}}])
            ]);
        // console.log("i am here boys !")
        console.log(totalExpenseResult,expenseCountResult)
        return res.status(200).json({totalExpenseResult,expenseCountResult,spendData,trendData,categoryData})
    }
    catch (err){
        return res.status(400).json({msg: "An error ocuured while trying to fetch chart please try agin later..."})
    }      
}


