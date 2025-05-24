require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const workoutRoutes = require("./routes/workoutRoutes");
const categories = require("./data/categories");
const exerciseRoutes = require('./routes/exerciseRoutes');
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/workouts", workoutRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use("/api/categories", categories);
app.use('/images', express.static("public/images"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
