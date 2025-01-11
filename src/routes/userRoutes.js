const express = require("express");
const { createUser, getAllUsers, login } = require("../controllers/userController");
const router = express.Router();

// Route to register a new user
router.post("/register", createUser); // Creating new user

// Route to fetch all users
router.get("/users", getAllUsers); // Get all users

// Route to login
router.post("/login", login); // Handle login

module.exports = router;
