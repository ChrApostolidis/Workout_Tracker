// routes/workoutRoutes.js
const express = require('express');
const router = express.Router();
const Workout = require('../models/workout');

// Create workout
router.post('/', async (req, res) => {
  // const { exercises } = req.body;

  // // Validation: Each exercise must have at least one set with reps and weight
  // if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
  //   return res.status(400).json({ error: "At least one exercise is required." });
  // }

  // for (const ex of exercises) {
  //   if (!ex.sets || !Array.isArray(ex.sets) || ex.sets.length === 0) {
  //     return res.status(400).json({ error: `Exercise "${ex.name}" must have at least one set.` });
  //   }
  //   for (const set of ex.sets) {
  //     if (
  //       set.reps === undefined ||
  //       set.weight === undefined ||
  //       set.reps === "" ||
  //       set.weight === "" ||
  //       isNaN(Number(set.reps)) ||
  //       isNaN(Number(set.weight))
  //     ) {
  //       return res.status(400).json({ error: `All sets for "${ex.name}" must have reps and weight.` });
  //     }
  //   }
  // }

  try {
    console.log(req.body);
    const workout = new Workout(req.body);
    const saved = await workout.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all workouts
router.get('/', async (req, res) => {
  try {
    const workouts = await Workout.find();
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one workout
router.get('/:id', async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Not found' });
    res.json(workout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update workout
router.put('/:id', async (req, res) => {
  try {
    const updated = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete workout
router.delete('/:id', async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.json({ message: 'Workout deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
    