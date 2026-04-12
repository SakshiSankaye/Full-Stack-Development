const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/portfolioDB")
.then(() => console.log("MongoDB Connected (Local)"))
.catch(err => console.log(err));
// Schema
const Contact = mongoose.model("Contact", {
    name: String,
    email: String,
    message: String
});

// API
app.post("/contact", async (req, res) => {
    try {
        const data = new Contact(req.body);
        await data.save();
        res.json({ message: "Saved Successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));