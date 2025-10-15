import { Router } from "express";
import * as authController from "../controllers/authController.js";

const router = Router();

// Register route
router.post("/register", authController.registerUser);

// Login route
router.post("/login", authController.userLogin);

export default router;
