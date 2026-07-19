import { Groups } from "../models/Group.js";
import { Expense } from "../models/Expense.js";
import { SettlementData } from "../models/SettlementDetails.js";

export async function calculateBalances (groupId,userId){
  try {
    const balances={};
    balances[userId]=0;
    
    //find current group expenses
    const expenses= await Expense.find({groupId: groupId});
    if (expenses.length===0) return(balances);
    
    const group= await Groups.findById(groupId);

    //initial amount 0 ;
    group.members.map((eachMember)=>balances[eachMember]=0 );
    
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
    //return net balances(stale)
    // return (balances);

    //mapping fresh balance after settlements 
    const settlementUpdates= await SettlementData.find({groupId:groupId});
    if (settlementUpdates.length===0) return balances;

    settlementUpdates.forEach((eachSettlement)=>{
      balances[eachSettlement.to]-= eachSettlement.amount
      balances[eachSettlement.from]+= eachSettlement.amount
    })

    return balances;
    
  } catch (error) {
    console.log(err);
    console.log ("An error showing transactions ....");
    return -1;
  }
}