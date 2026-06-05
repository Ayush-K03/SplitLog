import express from "express";
import { createUserInDatabase,handleUserLogin,displayHomepage,displayLoginpage } from "../controllers/authController.js"; 
export const router= express.Router();

router
.route("/signup")
    // .get()
    .post(createUserInDatabase)

router.route("/login")
    .get(displayLoginpage)
    .post(handleUserLogin)

router.route("/homepage")
    .get(displayHomepage)