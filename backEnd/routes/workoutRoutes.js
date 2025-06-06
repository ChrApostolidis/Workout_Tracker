// routes/workoutRoutes.js
const express = require('express');
const router = express.Router();
const Workout = require('../models/workout');
const auth = require('../middleware/auth');

// Create workout
router.post('/', auth, async (req, res) => {
  try {
    console.log('Auth token:', req.header('Authorization'));
    console.log('User ID:', req.userId);
    
    const workout = new Workout({
      ...req.body,
      user: req.userId
    });
    const saved = await workout.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Workout creation error:', err);
    res.status(400).json({ message: err.message });
  }
});

// Get all workouts
router.get('/', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.userId });
    res.json(workouts);
  } catch (error) {
    res.status(400).json({ message: error.message });
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

// // Update workout
// router.put('/:id', async (req, res) => {
//   try {
//     const updated = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(updated);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

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
