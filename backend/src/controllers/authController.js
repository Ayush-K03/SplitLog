import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { tokenGeneration } from "../middleware/authMiddleware.js";
import { User } from "../models/User.js";

export async function createUserInDatabase(req, res) {
  try {
    if (
      req.body.firstName.length===0 ||
      req.body.lastName.length===0 ||
      req.body.email.length===0||
      req.body.password.length===0
    ) 
    return res.status(400).send("Invalid Details... Try again"); 
    
    
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 11),
    });
    console.log("User was created !");
    tokenGeneration(user, res);
    res.status(201).send("Success !");
  } catch (error) {
    console.log("Error in creation of user!");
    console.log(error);
    res.status(400).send("Bad Input !");
  }
}

export async function handleUserLogin(req, res) {
      if (
      req.body.email.length===0||
      req.body.password.length===0
    ) 
    return res.status(400).send("Invalid Details... Try again"); 
  const user = await User.findOne({ email: req.body.email });
  if (!user) res.status(401).send("InValid Credentials !");
  const passwordValidation = await bcrypt.compare(
    req.body.password,
    user.password,
  );

  if (passwordValidation) {
    tokenGeneration(user, res);
    res.status(200).send("Verification successful");
    console.log("user logged in successfully");
  } else res.status(401).send("Wrong credentials!, unauthorized");
}

export async function displayHomepage(req, res) {
  res.send("welcome to homepage");
}

export async function displayLoginpage(req, res) {
  res.send("welcome to loginPage");
}
