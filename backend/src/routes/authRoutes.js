import express from "express";
import { createUserInDatabase,handleUserLogin,displayHomepage,displayLoginpage,logoutUser,userProfileInfo,updateUserPassword } from "../controllers/authController.js"; 
import { checkforToken } from "../middleware/authMiddleware.js";
export const userRouter= express.Router();

userRouter.route("/signup")
    // .get()
    .post(createUserInDatabase)

userRouter.route("/login")
    .get(displayLoginpage)
    .post(handleUserLogin)

userRouter.route("/homepage")
    .get(displayHomepage)

userRouter.route("/logout")
    .get(checkforToken, logoutUser)

userRouter.route("/profile")
    .get(checkforToken, userProfileInfo)

userRouter.route("/update-password")
    .patch(checkforToken, updateUserPassword)
