const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    addresses: [{ type: String }], // Changed from single address to multiple
    paymentMethods: [{ cardNumber: String, balance: Number }],
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
