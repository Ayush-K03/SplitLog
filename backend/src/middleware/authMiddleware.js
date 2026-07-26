import dotenv from 'dotenv/config';
import jwt from 'jsonwebtoken';

const secretKey= process.env.JWT_SECRET_KEY;

export function tokenGeneration (user,res){
    const payload = jwt.sign({
        userId : user._id,
        name:user.firstName,
        lastName:user.lastName,
        email:user.email
    },secretKey,{expiresIn : "7d"});
    console.log(user);
    res.cookie('token',payload,
        {httpOnly : true , maxAge : 7*24*60*60*1000,secure : true, sameSite : "none"}
    );
    console.log("A token was generated and stored in cookie..");
    
}


export function checkforToken(req,res,next){
    if (req.cookies?.token){
        try{
            const payload = jwt.verify(req.cookies.token,secretKey);
            req.user={...payload};
            next();
        }

        catch(err){
            res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'none' });
            console.log("token extraction failed from cookies ! ")
            console.log("token was removed ! ")
            return res.status(401).json({ msg: "Invalid or expired session, please log in again." });
        }
    }
    else{
        console.log("no token was found !");
        return res.status(401).json({ msg: "Unauthorized! Please log in." });
    }

}