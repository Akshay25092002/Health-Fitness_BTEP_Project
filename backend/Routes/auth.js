import express from "express";
import { register, login } from "../Controllers/authController.js";

const router = express.Router();
//Handles routes related to user authentication, such as registration and login.
router.post("/register", register);
router.post("/login", login);

export default router;
