const router = require("express").Router();
const authController = require("../controllers/authController");

// Register route
router.post("/register", authController.registerUser);

// Login route
router.post("/login", authController.userLogin);

module.exports = router;
