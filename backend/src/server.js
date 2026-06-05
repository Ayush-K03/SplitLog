import express from "express";
import cookieParser from 'cookie-parser';
import { connectToDatabase } from "./config/db.js";
import { router } from "./routes/authRoutes.js";
import { checkforToken, displayHomepage } from "./controllers/authController.js";

const app=express();
const port= 8000;

app.listen(port,()=>console.log(`http://localhost:${port}`));
connectToDatabase();

app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use("/api/auth",router);
app.get('/api/test-speed', (req, res) => {
  res.json({ message: "Speed test successful!" });
});
app.use(checkforToken);
app.use("/api/home",displayHomepage)

app.use((err,req,res,next)=>{
    console.log(err);
    const status= err.status||500;
    const message = err.status|| "Internal server error ! Try again later";
    res.status(status).json({err : message});
})
