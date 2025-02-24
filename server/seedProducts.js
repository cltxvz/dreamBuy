require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
    {
        name: "1 Hour Test",
        price: 60,
        image: "https://source.unsplash.com/600x400/?lamborghini",
        description: "1 Hour Test.",
        deliveryTime: 0.0417,
    },
    {
        name: "30 Minutes Test",
        price: 30,
        image: "https://source.unsplash.com/600x400/?lamborghini",
        description: "30 Minute Test.",
        deliveryTime: 0.0208,
    },
    {
        name: "10 Minutes Test",
        price: 10,
        image: "https://source.unsplash.com/600x400/?lamborghini",
        description: "10 Minute Test.",
        deliveryTime: 0.006944,
    },
    {
        name: "5 Minutes Test",
        price: 5,
        image: "https://source.unsplash.com/600x400/?private-jet",
        description: "5 Minute Test.",
        deliveryTime: 0.003472,
    },
    {
        name: "1 Minute Test",
        price: 1,
        image: "https://source.unsplash.com/600x400/?mansion",
        description: "1 Minute Test.",
        deliveryTime: 0.0006944,
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log("Luxury products added!");
        mongoose.connection.close();
    } catch (error) {
        console.error(error);
        mongoose.connection.close();
    }
};

seedDB();
