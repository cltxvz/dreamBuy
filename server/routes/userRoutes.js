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
