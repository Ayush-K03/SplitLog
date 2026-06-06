import express from "express";
import { createUserInDatabase,handleUserLogin,displayHomepage,displayLoginpage } from "../controllers/authController.js"; 
export const userRouter= express.Router();

userRouter
.route("/signup")
    // .get()
    .post(createUserInDatabase)

userRouter.route("/login")
    .get(displayLoginpage)
    .post(handleUserLogin)

userRouter.route("/homepage")
    .get(displayHomepage)