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
        if (user.paymentMethods.length === 0) return res.status(400).json({ message: "You must have at least one payment method to place an order." });

        const { selectedCard, selectedAddress } = req.body;
        if (!selectedAddress) return res.status(400).json({ message: "Please select a shipping address." });

        const card = user.paymentMethods.find(c => c.cardNumber === selectedCard);
        if (!card) return res.status(400).json({ message: "Invalid payment method" });

        const totalAmount = cart.items.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0);
        if (card.balance < totalAmount) return res.status(400).json({ message: "Insufficient balance" });

        // Deduct balance
        card.balance -= totalAmount;
        await user.save();

        // Assign `deliveryTime` per item
        const itemsWithDelivery = cart.items.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity,
            deliveryTime: item.productId.deliveryTime ? item.productId.deliveryTime : 7, // Default to 7 days if missing
            status: "Processing"
        }));

        const order = new Order({
            userId,
            items: itemsWithDelivery,
            totalAmount,
            address: selectedAddress, // Use the selected address from the frontend
            paymentMethod: { cardNumber: selectedCard, balance: card.balance },
            status: "Processing"
        });

        await order.save();
        await Cart.findOneAndDelete({ userId });

        res.json({ message: "Order placed successfully", order });
    } catch (error) {
        console.error("Checkout Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});



// Get all orders for a user (Now separating items)
router.get("/:userId", async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).populate("items.productId");

        // Transform orders so each item is treated as an individual entry
        const separatedOrders = orders.flatMap(order => 
            order.items.map(item => ({
                orderId: order._id,
                product: item.productId,
                quantity: item.quantity,
                status: item.status, // Individual item status
                address: order.address,
                paymentMethod: order.paymentMethod.cardNumber,
                totalAmount: item.productId.price * item.quantity,
                deliveryTime: item.deliveryTime,
                placedAt: order.placedAt
            }))
        );

        res.json(separatedOrders);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Cancel an order (Only canceling items that can be canceled)
router.post("/:orderId/cancel/:productId", async (req, res) => {
    try {
        const { orderId, productId } = req.params;
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        // Remove only the selected item from the order
        order.items = order.items.filter(item => item.productId.toString() !== productId);

        if (order.items.length === 0) {
            // If all items are canceled, delete the order
            await Order.findByIdAndDelete(orderId);
            return res.json({ message: "Order deleted successfully" });
        } else {
            await order.save();
            return res.json({ message: "Item removed from order", order });
        }
    } catch (error) {
        console.error("Cancel Order Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// Simulated order status updates (Item-based updates)
setInterval(async () => {
    try {
        const orders = await Order.find({ status: { $ne: "Delivered" } });

        for (const order of orders) {
            let allDelivered = true;
            let anyShipped = false;
            let anyOutForDelivery = false;

            order.items.forEach(item => {
                if (item.status === "Canceled" || item.status === "Delivered") return;

                const timeElapsed = (Date.now() - order.placedAt) / (1000 * 60 * 60 * 24); // Time in days

                if (!item.deliveryTime) item.deliveryTime = 7; // Ensure `deliveryTime` exists

                if (timeElapsed >= item.deliveryTime) {
                    item.status = "Delivered";
                } else if (timeElapsed >= item.deliveryTime - 0.125) {
                    item.status = "Out for Delivery";
                    anyOutForDelivery = true;
                } else if (timeElapsed >= item.deliveryTime / 2) {
                    item.status = "Shipped";
                    anyShipped = true;
                } else if (timeElapsed >= item.deliveryTime / 12) {
                    item.status = "Processed";
                } else {
                    allDelivered = false;
                }
            });

            if (allDelivered) {
                order.status = "Delivered";
            } else if (anyOutForDelivery) {
                order.status = "Out for Delivery";
            } else if (anyShipped) {
                order.status = "Shipped";
            } else {
                order.status = "Processed";
            }

            await order.save();
        }
    } catch (error) {
        console.error("Error updating order statuses:", error);
    }
}, 60000); // Runs every 1 minute


module.exports = router;
