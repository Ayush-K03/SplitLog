import { SettlementData } from "../models/SettlementDetails.js";
import { Groups } from "../models/Group.js";
import { Expense } from "../models/Expense.js";
import { calculateBalances } from "../config/balanceCalc.js";
import {User} from "../models/User.js"
import { validationForSettlementCreation } from "../models/Validation.js";


export async function createSettledRecord (req,res){
    try{ 
      const validationResult = validationForSettlementCreation.safeParse(req.body);
      if (validationResult.success === false){
        console.log("Validation failed for settlement creation");
        console.log(validationResult.error.format());
        return res.status(400).send("Invalid Details... Try again"); 
      } 

      await SettlementData.create({
          // description : req.body.description,
          groupId:req.body.groupId,
          from : req.user.userId,
          to:req.body.to,
          amount:req.body.amount
      })

      return res.json({msg:"success"});
    }
    catch(err){
        console.log(err);
        return res.json({msg:"An error occured!"});
    }
}


export async function showSettlements(req,res){
  const balanceSheet = await calculateBalances(req.params.groupId,req.user.userId);
  if (balanceSheet === -1) {
    return res.status(500).json({msg: "An error occurred while calculating balances"});
  }
  const creditors={};
  const debtors={};

  Object.entries(balanceSheet).map(([person,amount]) => {
    if (amount>0) creditors[person]=amount;
    // -ve -ve = +ve 
    else debtors[person]=-amount;
  });

  const creditChart= Object.entries(creditors).map(([user,amount])=>({user,amount}));
  const debitChart= Object.entries(debtors).map(([user,amount])=>({user,amount}));

//greedy approach   
  creditChart.sort((a,b)=> b.amount-a.amount);
  debitChart.sort((a,b)=> b.amount-a.amount);


  const settlements=[];
  let creditorPointer =0;
  let debitorPointer=0;

  while (creditorPointer<creditChart.length && debitorPointer<debitChart.length){
    const currentCreditor = creditChart[creditorPointer];
    const currentDebitor = debitChart[debitorPointer];
  
    if (Math.min(currentCreditor.amount,currentDebitor.amount)!=0){
      settlements.push({from:currentDebitor.user,to:currentCreditor.user,amount : Math.min(currentCreditor.amount,currentDebitor.amount)});
    }


    if (currentDebitor.amount > currentCreditor.amount){
      currentDebitor.amount-=currentCreditor.amount;
      currentCreditor.amount=0;
      creditorPointer++;
    }

    else{
      currentCreditor.amount-=currentDebitor.amount;
      currentDebitor.amount=0;
      debitorPointer++;
    }
    
  }

  await User.populate(settlements,{path:'from to',select:'firstName lastName'});

  settlements.map(value=>{
    console.log(`${value.from.firstName} needs to pay ${value.to.firstName} : ₹ ${value.amount}`);
  })
  console.log(settlements);

  res.json(settlements)

}

export async function showPastSettlementByUser(req,res){
  try{
    const data = await SettlementData.find({$or: [{from : req.user.userId}, {to:req.user.userId}]}).populate('from to','firstName lastName');
    res.status(200).json(data)
    console.log("here")
    console.log(data)
    console.log(req.user.userId) 
  }
  catch(err){
    res.json({msg: "Sorry an error occured !"})
    console.log(err)
  }
}