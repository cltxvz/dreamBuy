require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const server = http.createServer(app);

// Configure Socket.io
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Middlewares
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes(io));

// Root endpoint
app.get("/", (req, res) => {
    res.send("DreamBuy API is running...");
});

// Socket.io user connections
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
        socket.join(userId);
    }

    socket.on("disconnect", () => {
    });
});

// Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
