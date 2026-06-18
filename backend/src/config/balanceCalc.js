import { Groups } from "../models/Group.js";
import { Expense } from "../models/Expense.js";

export async function calculateBalances (groupId){
  try {
    const expenses= await Expense.find({groupId: groupId});
    if (expenses.length===0) return {message:"No expenses till now ! " };
    
    const group= await Groups.findById(groupId).populate('members','firstName');
    const balances={};
    //initial amount 0 ;
    group.members.map((eachMember)=>balances[eachMember._id]=0 );
    
    expenses.forEach((eachExpense)=>{
      const partiesInvolved=eachExpense.splitAmong.length;
      const amountInvolved=eachExpense.amount;
      const indiviualAmount = amountInvolved/partiesInvolved;

      //give payer all amount then debit his part 
      balances[eachExpense.paidBy]+=amountInvolved ;
      
      //map out debts
      eachExpense.splitAmong.forEach((value)=> {
        if (balances[value]==null) balances[value]=-indiviualAmount;
        else balances[value]-=indiviualAmount;
      });
    });
    return (balances);
  } catch (error) {
    console.log(err);
    console.log ("An error showing transactions ....");
    return -1;
  }
}