import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from "../models/User.js";
const secretKey= "youCANdoIT!"

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

function tokenGeneration (user,res){
    const payload = jwt.sign({
        userId : user._id,
        name:user.firstName,
        email:user.email
    },secretKey);

    res.cookie('token',payload);
}

export async function handleUserLogin (req,res,User){
    const user = await User.findOne({email:req.body.email});
    const givenPassword = bcrypt.hash(req.body.password,11);
    
    if (user.password==givenPassword){
        res.send("Verification successful");
    }
    else res.send("Wrong credentials!");


}


export function checkforToken(req,res,next){
    if (req.cookies?.token){
        try{
            const user = jwt.verify(req.cookies.token,secretKey);
            req.user={...user};
            next();
        }
        
        catch(err){
            res.clearCookie('token');
            console.log("token extraction failed from cookies ! ")
            console.log("token was removed ! ")
            res.redirect("/api/auth/signup");
        }
    }
    else{
        res.redirect("/api/auth/login");
    }

}


export async function displayHomepage(req,res){
    res.send("welcome to homepage");
}


export async function displayLoginpage(req,res){
    res.send("welcome to loginPage");
}


