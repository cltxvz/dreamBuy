const express = require("express");
const User = require("../models/User");
const router = express.Router();

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

// Add Payment Method
router.post("/:userId/payment", async (req, res) => {
    try {
        const { cardNumber, balance } = req.body;
        const user = await User.findById(req.params.userId);
        user.paymentMethods.push({ cardNumber, balance });
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
