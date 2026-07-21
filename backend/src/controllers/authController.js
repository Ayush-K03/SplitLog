import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { tokenGeneration } from "../middleware/authMiddleware.js";
import { User } from "../models/User.js";
import { validationForDetailsInLogin, validationForDetailsInSignup } from "../models/Validation.js";


export async function createUserInDatabase(req, res) {
  try {
    const validationResult = validationForDetailsInSignup.safeParse(req.body);
    if (validationResult.success === false){
      console.log("Validation failed for user creation");
      console.log(validationResult.error.format());
      return res.status(400).send("Invalid Details... Try again"); 
    } 
    
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 11),
    });

    console.log("User was created !");
    tokenGeneration(user, res);
    res.status(201).json("Success !");
  } 

  catch (error) {
    console.log("Error in creation of user!");
    console.log(error);
    res.status(400).send("Bad Input !");
  }
}

export async function handleUserLogin(req, res) {
  //checking validity of input
    const validationResult = validationForDetailsInLogin.safeParse(req.body);
    if (validationResult.success === false){
      console.log("Validation failed for user login");
      console.log(validationResult.error.format());
      return res.status(400).send("Invalid Details... Try again"); 
    } 

  console.log("login request received !");
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    console.log("no user found with this email !");
    return res.status(401).send("InValid Credentials !");
  }
    const passwordValidation = await bcrypt.compare(
    req.body.password,
    user.password,
  );

  if (passwordValidation) {
    tokenGeneration(user, res);
    console.log("user logged in successfully");
    return res.status(200).send("Verification successful");
  } 
  else return res.status(401).send("Wrong credentials!, unauthorized");
}

export async function displayHomepage(req, res) {
  res.send("welcome to homepage");
}

export async function displayLoginpage(req, res) {
  res.send("welcome to loginPage");
}
