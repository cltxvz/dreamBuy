const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    items: [
        {
            productId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Product", 
                required: true 
            },
            quantity: { 
                type: Number, 
                required: true 
            },
            deliveryTime: { // in days
                type: Number, 
                required: true 
            },
            status: {  // New status per item
                type: String,
                enum: ["Processing", "Processed", "Shipped", "Out for Delivery", "Delivered"],
                default: "Processing"
            },
            placedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    totalAmount: { 
        type: Number, 
        required: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    paymentMethod: { 
        cardNumber: String, 
        balance: Number 
    },
    placedAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model("Order", OrderSchema);
