const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true },
            deliveryTime: { type: Number, required: true } // Each item has its own delivery time
        }
    ],
    totalAmount: { type: Number, required: true },
    address: { type: String, required: true },
    paymentMethod: { cardNumber: String, balance: Number },
    status: { 
        type: String, 
        enum: ["Processing", "Processed", "Shipped", "Out for Delivery", "Delivered", "Canceled"], 
        default: "Processing" 
    },
    placedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
