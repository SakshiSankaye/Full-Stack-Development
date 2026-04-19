const express = require("express");
const router = express.Router();

const User = require("../models/User");

// SAVE DATA (Register)
router.post("/save", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide name, email, and password" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const user = new User({ name, email, password });
        await user.save();
        res.json({ message: "Data Saved", user: { _id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: "Registration failed", error: err.message });
    }
});

// GET DATA
router.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const user = await User.findOne({ email, password });

        if (user) {
            res.json({ message: "Login Success", user: { _id: user._id, name: user.name, email: user.email } });
        } else {
            res.status(401).json({ message: "Invalid Email or Password" });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: "Login failed", error: err.message });
    }
});

module.exports = router;