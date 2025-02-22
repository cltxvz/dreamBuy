const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const router = express.Router();

// Get user cart
router.get("/:userId", async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId }).populate("items.productId");
        if (!cart) return res.json({ items: [] });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Add item to cart
router.post("/:userId/add", async (req, res) => {
    try {
        const { productId } = req.body;
        let cart = await Cart.findOne({ userId: req.params.userId });

        if (!cart) {
            cart = new Cart({ userId: req.params.userId, items: [{ productId, quantity: 1 }] });
        } else {
            const existingItem = cart.items.find(item => item.productId.toString() === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.items.push({ productId, quantity: 1 });
            }
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Remove item from cart
router.post("/:userId/remove", async (req, res) => {
    try {
        const { productId } = req.body;
        let cart = await Cart.findOne({ userId: req.params.userId });

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Clear cart after checkout
router.post("/:userId/clear", async (req, res) => {
    try {
        await Cart.findOneAndDelete({ userId: req.params.userId });
        res.json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
