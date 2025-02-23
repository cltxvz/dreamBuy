const express = require("express");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL;

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

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Forgot Password Route
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Email does not exist" });
        }

        const resetToken = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "15m" });

        const resetLink = `${CLIENT_URL}/reset-password/${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "DreamBuy Password Reset",
            html: `<p>Click <a href="${resetLink}">here</a> to reset your DreamBuy password.</p>`,
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).json({ message: "Error sending email" });
            }

            res.json({ message: "Password reset link sent successfully!" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Reset Password Route
router.post("/reset-password/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: "Invalid token or user doesn't exist" });
        }

        user.password = password;
        await user.save();

        res.json({ message: "Password reset successful!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Token expired or invalid" });
    }
});

module.exports = router;
