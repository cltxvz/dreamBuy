const express = require("express");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");

module.exports = (io) => {
    const router = express.Router();

    // Helper to schedule individual item status updates
    const scheduleItemStatusUpdates = (order, item, io) => {
        const totalDeliveryMs = item.deliveryTime * 24 * 60 * 60 * 1000; // convert deliveryTime (days) to milliseconds
        const milestones = [
            { status: "Processed", timeRatio: 0.1 },
            { status: "Shipped", timeRatio: 0.5 },
            { status: "Out for Delivery", timeRatio: 0.9 },
            { status: "Delivered", timeRatio: 1.0 }
        ];

        milestones.forEach(milestone => {
            const delay = totalDeliveryMs * milestone.timeRatio;
            const triggerTime = new Date(item.placedAt).getTime() + delay;
            const currentTime = Date.now();
            const timeoutDelay = triggerTime - currentTime;

            if (timeoutDelay > 0) {
                setTimeout(async () => {
                    try {
                        const orderToUpdate = await Order.findById(order._id);
                        if (!orderToUpdate) return;

                        const itemToUpdate = orderToUpdate.items.id(item._id);
                        if (!itemToUpdate || itemToUpdate.status === "Delivered") return;

                        itemToUpdate.status = milestone.status;
                        await orderToUpdate.save();

                        io.to(order.userId.toString()).emit("orderUpdated", orderToUpdate);
                    } catch (error) {
                        console.error("Scheduled status update error:", error);
                    }
                }, timeoutDelay);
            }
        });
    };

    // Place an order
    router.post("/:userId/checkout", async (req, res) => {
        try {
            const userId = req.params.userId;
            const user = await User.findById(userId);
            const cart = await Cart.findOne({ userId }).populate("items.productId");

            if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });
            if (user.paymentMethods.length === 0) return res.status(400).json({ message: "You must have at least one payment method." });

            const { selectedCard, selectedAddress } = req.body;
            if (!selectedAddress) return res.status(400).json({ message: "Select a shipping address." });

            const card = user.paymentMethods.find(c => c.cardNumber === selectedCard);
            if (!card) return res.status(400).json({ message: "Invalid payment method" });

            const totalAmount = cart.items.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0);
            if (card.balance < totalAmount) return res.status(400).json({ message: "Insufficient balance" });

            card.balance -= totalAmount;
            await user.save();

            const itemsWithDelivery = cart.items.map(item => ({
                productId: item.productId._id,
                quantity: item.quantity,
                deliveryTime: item.productId.deliveryTime || 7,
                status: "Processing",
                placedAt: new Date()
            }));

            const order = new Order({
                userId,
                items: itemsWithDelivery,
                totalAmount,
                address: selectedAddress,
                paymentMethod: { cardNumber: selectedCard, balance: card.balance },
                status: "Processing"
            });

            const savedOrder = await order.save();
            await Cart.findOneAndDelete({ userId });

            // Schedule updates individually for each item
            savedOrder.items.forEach(item => scheduleItemStatusUpdates(savedOrder, item, io));

            res.json({ message: "Order placed successfully", order: savedOrder });
        } catch (error) {
            console.error("Checkout Error:", error);
            res.status(500).json({ message: "Server error" });
        }
    });

    // Get all orders for a user
    router.get("/:userId", async (req, res) => {
        try {
            const orders = await Order.find({ userId: req.params.userId }).populate("items.productId");

            const separatedOrders = orders.flatMap(order => 
                order.items
                    .filter(item => item.productId) // Filters out missing products
                    .map(item => ({
                        orderId: order._id,
                        product: item.productId,
                        quantity: item.quantity,
                        status: item.status,
                        address: order.address,
                        paymentMethod: order.paymentMethod.cardNumber,
                        totalAmount: item.productId.price * item.quantity,
                        deliveryTime: item.deliveryTime,
                        placedAt: item.placedAt
                    }))
            );

            res.json(separatedOrders);
        } catch (error) {
            console.error("Error in GET /orders/:userId →", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    });


    // Cancel an order item
    router.post("/:orderId/cancel/:productId", async (req, res) => {
        try {
            const { orderId, productId } = req.params;

            // Find order
            const order = await Order.findById(orderId).populate('items.productId');
            if (!order) return res.status(404).json({ message: "Order not found" });

            // Find the item being canceled
            const itemToCancel = order.items.find(item => item.productId._id.toString() === productId);
            if (!itemToCancel) return res.status(404).json({ message: "Product not found in order" });

            // Calculate refund
            const refundAmount = itemToCancel.productId.price * itemToCancel.quantity;

            // Find the user to refund
            const user = await User.findById(order.userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            // Refund the user's card
            const card = user.paymentMethods.find(c => c.cardNumber === order.paymentMethod.cardNumber);
            if (card) {
                card.balance += refundAmount;
                await user.save();
            } else {
                return res.status(400).json({ message: "Original payment method not found, refund failed." });
            }

            // Remove the canceled item from the order
            order.items = order.items.filter(item => item.productId._id.toString() !== productId);

            // If no items left, remove entire order
            if (order.items.length === 0) {
                await Order.findByIdAndDelete(orderId);
                return res.json({ message: "Order deleted and amount refunded successfully" });
            } else {
                await order.save();
                return res.json({ message: "Item canceled and amount refunded successfully", order });
            }

        } catch (error) {
            console.error("Cancel Order Error:", error);
            res.status(500).json({ message: "Server error" });
        }
    });

    
    return router;
};
