const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// import routes
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");

// connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/fashionDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// use routes
app.use("/api", userRoutes);
app.use("/api", orderRoutes);
app.listen(5000, () => {
    console.log("Server running on port 5000");
});