const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

router.get("/test", (req, res) => {
    res.send("Product API is working!");
});

// Get all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
