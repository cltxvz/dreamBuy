const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET;

// Get user data
router.get("/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Update user profile (Name, Email, Password)
router.put("/:userId/update", async (req, res) => {
    try {
        const { name, email, currentPassword, newPassword } = req.body;
        const user = await User.findById(req.params.userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ message: "Email already in use" });
            user.email = email;
        }

        if (name) user.name = name;

        if (newPassword) {
            if (!currentPassword) return res.status(400).json({ message: "Current password is required" });

            if (currentPassword !== user.password) {
                return res.status(400).json({ message: "Incorrect current password" });
            }

            user.password = newPassword;
        }

        await user.save();

        // Generate a new JWT token with updated info
        const token = jwt.sign({ userId: user._id, name: user.name, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

        res.json({ message: "Profile updated successfully", user, token });
    } catch (error) {
        console.error("Profile Update Error:", error);
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
        
        // Compare plain text password directly
        if (password !== user.password) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ userId: user._id, name: user.name, email: user.email, token });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Update Address
router.put("/:userId/address", async (req, res) => {
    try {
        const { address } = req.body;
        const user = await User.findByIdAndUpdate(req.params.userId, { address }, { new: true });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Add Address
router.post("/:userId/address", async (req, res) => {
    try {
        const { address } = req.body;
        const user = await User.findById(req.params.userId);
        user.addresses.push(address);
        await user.save();
        res.json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Delete Address
router.delete("/:userId/address/:index", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        
        // Allow users to delete all addresses, but require one at checkout
        user.addresses.splice(req.params.index, 1);
        await user.save();

        res.json(user.addresses);
    } catch (error) {
        console.error("Delete Address Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Add Payment Method
const generateCardNumber = () => {
    return "4" + Math.random().toString().slice(2, 16); // Generates a 16-digit credit card number
};

router.post("/:userId/payment", async (req, res) => {
    try {
        const { balance } = req.body;
        const user = await User.findById(req.params.userId);
        const newCard = { cardNumber: generateCardNumber(), balance };
        user.paymentMethods.push(newCard);
        await user.save();
        res.json(user.paymentMethods);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Delete Payment Method
router.delete("/:userId/payment/:cardNumber", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        user.paymentMethods = user.paymentMethods.filter(card => card.cardNumber !== req.params.cardNumber);
        await user.save();
        res.json(user.paymentMethods);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
