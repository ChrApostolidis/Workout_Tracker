import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import workoutRoutes from "./routes/workoutRoutes.js";
import categories from "./data/categories.js";
import exerciseRoutes from "./routes/exerciseRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV !== "production") {
  app.use(cors());
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/workouts", workoutRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/categories", categories);
app.use("/api/auth", authRoutes);

app.use("/images", express.static("public/images"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontEnd/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontEnd/dist/index.html"));
  });
}
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
