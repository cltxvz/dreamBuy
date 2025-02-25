const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    addresses: { type: [String], default: [] },
    paymentMethods: { type: [{ cardNumber: String, balance: Number }], default: [] },
});

module.exports = mongoose.model("User", UserSchema);
