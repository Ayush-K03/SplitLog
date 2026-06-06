import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { tokenGeneration } from '../middleware/authMiddleware.js';
import { User } from "../models/User.js";


export async function createUserInDatabase(req,res){
    try{
        const user = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email:req.body.email,
            password: await bcrypt.hash(req.body.password,11)
        })
        res.status(201);
        console.log("User was created !");
        tokenGeneration(user,res);
        res.send("Success !");
    }

    catch (error) {
        console.log("Error in creation of user!");
        console.log(error);
        res.send("Error occoured !");
    }
}


export async function handleUserLogin (req,res){
    const user = await User.findOne({email:req.body.email});
    const passwordValidation = await bcrypt.compare(req.body.password,user.password);
    
    if (passwordValidation){
        tokenGeneration(user,res);
        res.send("Verification successful");
        console.log("user logged in successfully");
    }
    else res.send("Wrong credentials!");


}

export async function displayHomepage(req,res){
    res.send("welcome to homepage");
}


export async function displayLoginpage(req,res){
    res.send("welcome to loginPage");
}


