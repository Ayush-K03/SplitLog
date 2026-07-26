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

      const existingPending = await SettlementData.findOne({
          from: req.user.userId,
          to: req.body.to,
          groupId: req.body.groupId,
          status: "pending"
      });
      if (existingPending) {
          return res.status(409).json({msg: "A pending settlement request already exists for this user"});
      }


      await SettlementData.create({
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


export async function approveSettlement(req,res){
    try{
        const settlement = await SettlementData.findById(req.params.settlementId);
        if (!settlement){
            return res.status(404).json({msg: "Settlement not found"});
        }

        //2 backend check that user whom approval belong to 
        // and if status is no more pending
        if (settlement.to.toString() !== req.user.userId){
            return res.status(403).json({msg: "Only the receiver can approve this settlement"});
        }
        if (settlement.status !== "pending"){
            return res.status(400).json({msg: `Settlement is already ${settlement.status}`});
        }
        
        settlement.status = "approved";
        await settlement.save();
        return res.status(200).json({msg: "Settlement approved successfully!"});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({msg: "Error in approving settlement"});
    }
}



export async function getPendingSettlementList(req,res){
  try{
    const query ={to: req.user.userId,status:"pending"};
    const pendingList = await SettlementData.find(query);
    console.log(pendingList)
    res.status(200).json(pendingList)
  }
  catch(err){
    res.status(500).json({msg:"An error occured while fetching approval list form server!"})
  }
}