import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { tokenGeneration } from "../middleware/authMiddleware.js";
import { User } from "../models/User.js";
import { Expense } from "../models/Expense.js";
import { Groups } from "../models/Group.js";
import { SettlementData } from "../models/SettlementDetails.js";

import { validationForDetailsInLogin, validationForDetailsInSignup } from "../models/Validation.js";

//done
export async function createUserInDatabase(req, res) {
  try {
    const validationResult = validationForDetailsInSignup.safeParse(req.body);
    if (validationResult.success === false){
      console.log("Validation failed for user creation");
      console.log(validationResult.error.format());
      return res.status(400).json({msg: "Invalid Details... Try again"}); 
    } 
    
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 11),
    });

    console.log("User was created !");
    tokenGeneration(user, res);
    res.status(201).json({msg: "Success !"});
  } 

  catch (error) {
    res.status(400).json({msg: "Error in creation of user!"});
  }
}

//done
export async function handleUserLogin(req, res) {
  //checking validity of input
    const validationResult = validationForDetailsInLogin.safeParse(req.body);
    if (validationResult.success === false){
      console.log("Validation failed for user login");
      console.log(validationResult.error.format());
      return res.status(400).json({msg: "Password length too short or email is invalid !"}); 
    } 


    try{
    console.log("login request received !");
    const user = await User.findOne({ email:req.body.email });
    if (!user) {
      console.log("no user found with this email !");
      return res.status(404).json({msg: "No user found with this email! Please signup first"});
    }

    const passwordValidation = await bcrypt.compare(req.body.password,user.password);
    if (passwordValidation) {
      tokenGeneration(user, res);
      console.log("user logged in successfully");
      return res.status(200).json({msg: "Verification successful"});
    } 
    else return res.status(401).json({msg: "Wrong credentials!, Unauthorized"})
    }
    catch (err) {
      console.log("error during login");
      console.log(err);
      return res.status(500).json({msg: "Something went wrong while logging in, please try again."});
    }
}

export async function displayHomepage(req, res) {
  res.send("welcome to homepage");
}

export async function displayLoginpage(req, res) {
  console.log("here99")
  res.send("welcome to loginPage");
}

export async function userProfileInfo(req, res) {
  try{
    console.log("user profile info request received !");
    const expenseCount = await Expense.countDocuments({paidBy: req.user.userId});
    const groupCount = await Groups.countDocuments({members: req.user.userId});
    const joinedOn = await User.findById(req.user.userId);
    
    const properDate = joinedOn?.createdAt ? new Date(joinedOn.createdAt).toLocaleDateString() : '';
    console.log(properDate);
    const settlementCount = await SettlementData.countDocuments({$or: [{from: req.user.userId}, {to: req.user.userId}]});
    // console.log(expenseCount,groupCount,joinedOn,settlementCount);
    
    res.json({ name: req.user.name, email: req.user.email , 
      userId: req.user.userId.slice(0,5),expenseCount,groupCount,
      settlementCount,properDate
    });
  }
  catch(err){
    console.log("error fetching profile info");
    console.log(err);
    res.status(500).json({msg: "Could not load profile info, please try again."});
  }

}

export async function logoutUser(req,res) {
  res.clearCookie("token");
  return res.status(200).json({});
}

export async function updateUserPassword(req,res) {
  try{
    const currentUser = await User.findById(req.user.userId);
    const oldPasswordValidation = await bcrypt.compare(req.body.oldPassword, currentUser.password);

    if (!oldPasswordValidation) {
      return res.status(401).send({msg: "Current password is incorrect"});
    }
    const newPassword = await bcrypt.hash(req.body.newPassword, 11);
    const user = await User.updateOne({ _id: req.user.userId }, 
      { $set: { password: newPassword }}
    );
    res.status(203).json({msg: "Password updated successfully"});
  }
  catch(err){
    console.log("error in updating user password");
    console.log(err);
    return res.status(500).send("Error in updating password !");
  }
}
