import dotenv from 'dotenv/config';
import jwt from 'jsonwebtoken';

const secretKey= process.env.JWT_SECRET_KEY;
console.log("Checking JWT Key status:", process.env.JWT_SECRET_KEY ? "Loaded Successfully" : "MISSING ❌");
export function verifyCheck(req,res,next){
    console.log("here11")
    console.log(req.cookies)
    if (req.cookies?.token){
        console.log("here12")
        try{
            const payload = jwt.verify(req.cookies.token,secretKey);
            req.user={...payload};
            res.status(200).send({isAuthenticated: true, user:req.user});
        }

        catch(err){
            console.log(err);
            res.clearCookie('token');
            console.log("token extraction failed from cookies ! ")
            console.log("token was removed ! ")
            res.status(401).send({isAuthenticated: false});
        }
    }
    else{
        console.log("no token was found !");
        res.status(400).send({isAuthenticated: false});
    }

}