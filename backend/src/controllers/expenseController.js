import { Groups } from "../models/Group.js";
import { Expense } from "../models/Expense.js";
import { calculateBalances } from "../config/balanceCalc.js";
import {User} from "../models/User.js"

export async function addExpense(req, res) {
  try {
    if (
      !req.body.description ||
      !req.body.splitAmong ||
      req.body.amount <= 0 ||
      !req.body.splitAmong.length
    )
      return res.status(400).send("Invalid Entries!");
    
    const expenseEntry = await Expense.create({
      description: req.body.description,
      amount: req.body.amount,
      paidBy: req.user.userId,
      splitAmong: [req.user.userId,...req.body.splitAmong],
      groupId: req.params.groupId,
    });
    console.log("User expense was added ! ");
    res.status(200).send("expense was added successfully");
  } catch (err) {
    console.log("Failed adding an expense in the db");
    console.log(err);
    res.status(400).send("Error in adding transaction ! ");
  }
}

export async function showExpenses(req, res) {
  try {
    const expenses = await Expense.find({ groupId: req.params.groupId });
    if (expenses.length === 0)
      return res.status(200).send("No expenses created till now ....");
    res.status(200).json(expenses);

    // //fetch expense of current user is part of
    // const expenses = await expense.find({splitAmong: req.user.userId})
    // .populate('paidBy','firstName')
    // .populate('splitAmong', 'firstName');

    // if (!expenses){
    //     console.log("No matching expense was found");
    //     return res.send("No expense till now ");
    // }
    // console.log("User expenses were shown acc. !");
    // console.log(expenses);
    // res.json(expenses);
  } catch (err) {
    console.log("an error 5 occured !");
    console.log(err);
    res.status(401).send("Error in showing transaction !");
  }
}

export async function checkIfUserBelongToGroup(req, res, next) {
  const groupExsist = await Groups.findById(req.params.groupId);
  if (!groupExsist) return res.status(200).send("Such group does not exsist");
  const userInGroup = groupExsist.members.includes(req.user.userId);
  if (!userInGroup || !groupExsist)
    return res.status(403).send("You do not belong to this group");
  else next();
}

export async function showIndiviualBalances (req,res){
  const balanceSheet = await calculateBalances(req.params.groupId);
  console.log(balanceSheet)
  if (!balanceSheet) res.send("an error 89 occured");
  res.json(balanceSheet);
}

// add someone who is not in group , in balance object 
// then you have to show them as external while givig back the result 



export async function showSettlements(req,res){
  const balanceSheet = await calculateBalances(req.params.groupId);
  const creditors={};
  const debtors={};


  Object.entries(balanceSheet).map(([person,amount]) => {
    if (amount>0) creditors[person]=amount;
    else debtors[person]=-amount;
  });

  const creditChart= Object.entries(creditors).map(([user,amount])=>({user,amount}));
  const debitChart= Object.entries(debtors).map(([user,amount])=>({user,amount}));
  // const debitChart= Object.entries(debtors);
  
  creditChart.sort((a,b)=> b.amount-a.amount);
  debitChart.sort((a,b)=> b.amount-a.amount);


  const settlements=[];
  let creditorPointer =0; let debitorPointer=0;

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
  res.json(creditors);
}