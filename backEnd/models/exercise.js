import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: String,
  category: String,
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

export default Exercise;