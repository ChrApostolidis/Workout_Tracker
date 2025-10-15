import express from "express";
import * as exercisesController from "../controllers/exerciseController.js";

const router = express.Router();

router.get("/", exercisesController.getExercises);

export default router;
