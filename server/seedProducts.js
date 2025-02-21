require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
    {
        name: "Lamborghini Aventador",
        price: 500000,
        image: "https://source.unsplash.com/600x400/?lamborghini",
        description: "A high-performance sports car with a V12 engine.",
        deliveryTime: 7,
    },
    {
        name: "Gulfstream G650 Jet",
        price: 65000000,
        image: "https://source.unsplash.com/600x400/?private-jet",
        description: "A luxurious private jet with state-of-the-art technology.",
        deliveryTime: 14,
    },
    {
        name: "Luxury Mansion in Beverly Hills",
        price: 25000000,
        image: "https://source.unsplash.com/600x400/?mansion",
        description: "An exquisite mansion with a pool, home theater, and more.",
        deliveryTime: 30,
    },
    {
        name: "Rolex Daytona",
        price: 30000,
        image: "https://source.unsplash.com/600x400/?rolex",
        description: "A luxury timepiece crafted from the finest materials.",
        deliveryTime: 3,
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
