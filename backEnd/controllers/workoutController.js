const Workout = require("../models/workout");
const User = require("../models/user");

exports.postCreateWorkout = async (req, res) => {
  try {
    // Create the workout
    const workout = new Workout({
      ...req.body,
      user: req.userId,
    });

    // Save the workout
    const savedWorkout = await workout.save();

    // Update the user's workouts array
    await User.findByIdAndUpdate(
      req.userId,
      { $push: { workouts: savedWorkout._id } },
      { new: true }
    );

    console.log("Workout saved:", savedWorkout);
    console.log("User ID:", req.userId);

    res.status(201).json(savedWorkout);
  } catch (err) {
    console.error("Error creating workout:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.userId })
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .exec();

    res.json(workouts);
  } catch (error) {
    console.error("Error fetching workouts:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.getOneWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ message: "Not found" });
    res.json(workout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteWorkout = async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.json({ message: "Workout deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
