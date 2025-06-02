const mongoose = require("mongoose");

const setSchema = new mongoose.Schema({
  reps: Number,
  weight: Number,
});

const exerciseSchema = new mongoose.Schema({
  category: String,
  name: String,
  sets: [setSchema],
});

const workoutSchema = new mongoose.Schema(
  {
    exercises: [exerciseSchema],
    date: {
      type: Date,
      default: Date.now,
    },
    duration: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Workout", workoutSchema);
