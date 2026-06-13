import { Groups } from "../models/Group.js";
import { Expense } from "../models/Expense.js";

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

export async function calculateBalances (req,res){
  try {
    const expenses= await Expense.find({groupId: req.params.groupId});
    if (expenses.length===0) return res.send("NO EXPENSE till now !").status(200);
    
    const group= await Groups.findById(req.params.groupId).populate('members','firstName');
    const balances={};
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
    // const result ={};
    // balances.map((value)=>console.log(value));
    res.json(balances);
  } catch (error) {
    console.log(err);
    res.send ("An error showing transactions ....");
  }
}

// add someone who is not in group , in balance object 
// then you have to show them as external while givig back the result 
