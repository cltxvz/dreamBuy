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
        const { productId, quantity } = req.body;
        const userId = req.params.userId;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1." });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Check if the product already exists in the cart
        const existingItem = cart.items.find((item) => item.productId.toString() === productId);

        if (existingItem) {
            // If the product exists, increase the quantity
            existingItem.quantity += quantity;
        } else {
            // Otherwise, add the new product
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        res.json({ message: "Product added to cart.", cart });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Decrease product quantity in cart
router.post("/:userId/decrease", async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.params.userId;

        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found." });

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart." });
        }

        if (cart.items[itemIndex].quantity > 1) {
            // Reduce quantity by 1
            cart.items[itemIndex].quantity -= 1;
        } else {
            // Remove product if quantity reaches 0
            cart.items.splice(itemIndex, 1);
        }

        await cart.save();
        res.json({ message: "Quantity updated successfully.", cart });
    } catch (error) {
        console.error("Error decreasing quantity:", error);
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
