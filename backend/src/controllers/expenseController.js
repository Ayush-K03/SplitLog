import { Groups } from "../models/Group.js";
import { Expense } from "../models/Expense.js";
import { calculateBalances } from "../config/balanceCalc.js";
import {User} from "../models/User.js"
import { validationForExpenseCreation } from "../models/Validation.js";
//middleware to check if user belongs to group or not
export async function checkIfUserBelongToGroup(req, res, next) {
  const groupExsist = await Groups.findById(req.params.groupId);
  if (!groupExsist) return res.status(404).json({msg: "Group not found"});
  const userInGroup = groupExsist.members.includes(req.user.userId);
  if (!userInGroup)
    return res.status(403).send("You do not belong to this group");
  else next();
}

//done
export async function addExpense(req, res) {
  try {
    const validationResult = validationForExpenseCreation.safeParse(req.body);
    if (validationResult.success === false){
      console.log("Validation failed for expense creation");
      console.log(validationResult.error.format());
      return res.status(422).json({msg: "Please enter valid details for expense creation !"}); 
    } 

    console.log(req.body.category);
    const expenseEntry = await Expense.create({
      description: req.body.description,
      amount: req.body.amount,
      paidBy: req.user.userId,
      splitAmong: [req.user.userId,...req.body.splitAmong],
      groupId: req.params.groupId,
      category : req.body.category,
    });
    console.log("User expense was added ! ");
    return res.status(200).json({msg: "expense was added successfully"});
  } 
  
  catch (err) {
    console.log("Failed adding an expense in the db");
    console.log(err);
    res.status(500).json({msg: "Error in adding transaction ! "});
  }
}

export async function showExpenses(req, res) {
  try {
    const expenses = await Expense.find({ groupId: req.params.groupId }).populate('paidBy splitAmong' , 'firstName');
    if (expenses.length === 0) return res.status(200).json([]);
    res.status(200).json(expenses);

  } catch (err) {
    console.log(err);
    res.status(401).json({msg: "Error in showing transaction !"});
  }
}


export async function showIndiviualBalances (req,res){
  const balanceSheet = await calculateBalances(req.params.groupId,req.user.userId);

  if (balanceSheet===-1) res.status(500).json({msg: "An error occurred while calculating balances"});
  const userExpenseInGroup = balanceSheet[req.user.userId];
  res.json({balanceSheet,userExpenseInGroup});
}

// add someone who is not in group , in balance object 
// then you have to show them as external while givig back the result 
export async function userExpenseAcrossGroups(req,res){
    const groupInfo = await Groups.find({members: req.user.userId});
    
    let positiveBalance=0;
    let negativeBalance=0;

    if (!groupInfo.length){
        console.log("User does not belong to any group !");
        return res.status(201).json({positiveBalance,negativeBalance});
    }
    for( const value of groupInfo){
      const balance = await calculateBalances(value._id,req.user.userId);

      if (balance === -1) {
        console.log(`Skipping group ${value._id} — balance calculation failed`);
        continue;
      }

      const financialStatus = balance[req.user.userId] ?? 0;
      console.log(financialStatus);
      if ( financialStatus>0) positiveBalance+= financialStatus;
      else negativeBalance -= financialStatus;
    }
    console.log(req.user.userId);
    res.json({positiveBalance,negativeBalance});
    console.log(positiveBalance);
    console.log(negativeBalance);

}
