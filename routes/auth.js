const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./config/config.env" });

const User = require("../models/User");

// Route for user registration
router.post("/register", async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  // Check if all required fields are provided
  if (!email || !password || !confirmPassword) {
    return res
      .status(400)
      .json({ error: "Please complete all required fields." });
  }

  // Validate email format using regular expression
  const emailRegex = new RegExp(
    /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/,
    "gm"
  );
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Email is invalid" });
  }

  // Check if email already exists
  const userAlreadyExist = await User.findOne({ email });

  if (userAlreadyExist) {
    return res
      .status(400)
      .json({ error: "Account with this Email already exists." });
  }

  // Check password length
  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters long." });
  }

  // Check if password and confirmPassword match
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      userId: Math.random().toString(36).substr(2, 9), // Generate a random user ID
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
    });

    // Save the new user
    const result = await newUser.save();

    return res
      .status(201)
      .json({
        ...result._doc,
        password: undefined,
        confirmPassword: undefined,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// Route for user login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Please provide correct email and password." });
  }

  // Validate email format using regular expression
  const emailRegex = new RegExp(
    /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/,
    "gm"
  );
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Email is invalid" });
  }

  try {
    // Find the user by email
    const userExits = await User.findOne({ email });

    // If user does not exist
    if (!userExits) {
      return res.status(401).json({ error: "User not found." });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, userExits.password);

    // If passwords do not match
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid Email or password." });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: userExits._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    // Return the token
    return res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
