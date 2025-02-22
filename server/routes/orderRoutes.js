const express = require("express");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");
const router = express.Router();

// Place an order
router.post("/:userId/checkout", async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        const cart = await Cart.findOne({ userId }).populate("items.productId");

        if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });

        const { selectedCard } = req.body;
        const totalAmount = cart.items.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0);

        // Check if payment method is valid
        const card = user.paymentMethods.find(c => c.cardNumber === selectedCard);
        if (!card) return res.status(400).json({ message: "Invalid payment method" });

        // Check if funds are sufficient
        if (card.balance < totalAmount) return res.status(400).json({ message: "Insufficient balance" });

        // Deduct balance from card
        card.balance -= totalAmount;
        await user.save();

        // Calculate max delivery time from ordered products
        const deliveryTime = Math.max(...cart.items.map(item => item.productId.deliveryTime));

        // Create new order
        const order = new Order({
            userId,
            items: cart.items.map(item => ({ productId: item.productId._id, quantity: item.quantity })),
            totalAmount,
            address: user.address,
            paymentMethod: { cardNumber: selectedCard, balance: card.balance },
            deliveryTime
        });

        await order.save();

        // Clear the user's cart after checkout
        await Cart.findOneAndDelete({ userId });

        res.json({ message: "Order placed successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get all orders for a user
router.get("/:userId", async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).populate("items.productId");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Simulated order status updates
setInterval(async () => {
    try {
        const orders = await Order.find({ status: { $ne: "Delivered" } });

        for (const order of orders) {
            const timeElapsed = (Date.now() - order.placedAt) / (1000 * 60 * 60 * 24); // Time elapsed in days

            if (timeElapsed >= order.deliveryTime) {
                order.status = "Delivered";
            } else if (timeElapsed >= order.deliveryTime - 0.125) { // ~3 hours before
                order.status = "Out for Delivery";
            } else if (timeElapsed >= order.deliveryTime / 2) {
                order.status = "Shipped";
            } else if (timeElapsed >= order.deliveryTime / 12) {
                order.status = "Processed";
            }
            await order.save();
        }
    } catch (error) {
        console.error("Error updating order statuses:", error);
    }
}, 60000); // Runs every 1 minute

module.exports = router;
