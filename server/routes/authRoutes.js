const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET;

// Signup
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // **Store the password as plain text**
        const newUser = new User({ name, email, password });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id, name: newUser.name, email: newUser.email }, SECRET_KEY, { expiresIn: "1h" });

        res.status(201).json({ userId: newUser._id, name: newUser.name, email: newUser.email, token });
    } catch (error) {
        console.error("❌ Sign-Up Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});



// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        
        // **Compare plain text password directly**
        if (password !== user.password) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ userId: user._id, name: user.name, email: user.email, token });
    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});





module.exports = router;
