const secretKey= process.env.JWT_SECRET_KEY;
import jwt from 'jsonwebtoken';

export function tokenGeneration (user,res){
    const payload = jwt.sign({
        userId : user._id,
        name:user.firstName,
        email:user.email
    },secretKey,{expiresIn : "7d"});

    res.cookie('token',payload,
        {httpOnly : true , maxAge : 7*24*60*60*1000,secure : true, sameSite : 'lax'}
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
            res.clearCookie('token');
            console.log("token extraction failed from cookies ! ")
            console.log("token was removed ! ")
            res.status(401).redirect("/api/auth/signup");
        }
    }
    else{
        console.log("no token was found !");
        res.status(307).redirect("/api/auth/login");
    }

}