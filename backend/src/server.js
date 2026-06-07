import express from "express";
import cookieParser from 'cookie-parser';
import { connectToDatabase } from "./config/db.js";
import { userRouter } from "./routes/authRoutes.js";
import { displayHomepage } from "./controllers/authController.js";
import { checkforToken } from "./middleware/authMiddleware.js";
import { groupRouter } from "./routes/groupRoutes.js";
import { expenseRouter } from "./routes/expenseRoutes.js";


const app=express();

const port= 8000;

app.listen(port,()=>console.log(`http://localhost:${port}`));
connectToDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use("/api/auth",userRouter);

app.use(checkforToken);

//protected routes

app.get("/api/home",displayHomepage);
app.use("/api/groups",groupRouter);
app.use("/api",expenseRouter);


app.use((err,req,res,next)=>{
    console.log(err.message);
    const status= err.status||500;
    const message = err.message|| "Internal server error ! Try again later";
    res.status(status).json({err : message});
})

