const secretKey= "youCANdoIT!";
import jwt from 'jsonwebtoken';

export function verifyCheck(req,res,next){
    if (req.cookies?.token){
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