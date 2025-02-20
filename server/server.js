require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5001;

app.get("/", (req, res) => {
    res.send("DreamBuy API is running...");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
