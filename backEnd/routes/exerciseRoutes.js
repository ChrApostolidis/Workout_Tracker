const express = require("express");
const router = express.Router();

const exercisesController = require("../controllers/exerciseController");

router.get("/", exercisesController.getExercises);

module.exports = router;
