const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// import routes
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");

// connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/fashionDB")
.then(async () => {
    console.log("MongoDB Connected");
    // Seed products if not exist
    const Product = require("./models/Product");
    const count = await Product.countDocuments();
    if (count === 0) {
        const products = [
            { name: "Men's Jacket", category: "Men", price: 1999, rating: 4.5, image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=600" },
            { name: "Men's T-Shirt", category: "Men", price: 799, rating: 4.2, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600" },
            { name: "Women's Dress", category: "Women", price: 1499, rating: 4.6, image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600" },
            { name: "Women's Top", category: "Women", price: 999, rating: 4.1, image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600" },
            { name: "Sneakers", category: "Shoes", price: 2999, rating: 4.7, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600" },
            { name: "Formal Shoes", category: "Shoes", price: 2499, rating: 4.4, image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600" },
            { name: "Handbag", category: "Accessories", price: 1899, rating: 4.3, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600" },
            { name: "Sunglasses", category: "Accessories", price: 599, rating: 4.0, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600" }
        ];
        await Product.insertMany(products);
        console.log("Products seeded");
    }
})
.catch(err => console.log(err));

// use routes
app.use("/api", userRoutes);
app.use("/api", orderRoutes);
app.use("/api", productRoutes);
app.listen(5000, () => {
    console.log("Server running on port 5000");
});