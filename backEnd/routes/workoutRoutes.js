// routes/workoutRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import * as workoutController from "../controllers/workoutController.js";

const router = express.Router();

// Create workout
router.post("/", auth, workoutController.postCreateWorkout);

// Get all workouts
router.get("/", auth, workoutController.getWorkouts);

// Get one workout
router.get("/:id", workoutController.getOneWorkout);

// Delete workout
router.delete("/:id", workoutController.deleteWorkout);

// // Update workout
// router.put('/:id', async (req, res) => {
//   try {
//     const updated = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(updated);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

export default router;
