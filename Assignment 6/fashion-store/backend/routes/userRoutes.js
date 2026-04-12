const express = require("express");
const router = express.Router();

const User = require("../models/User");

// SAVE DATA
router.post("/save", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.send("Data Saved");
    } catch (err) {
        res.status(500).send(err);
    }
});

// GET DATA
router.get("/users", async (req, res) => {
    const users = await User.find();
    res.json(users);
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (user) {
        res.send("Login Success");
    } else {
        res.send("Invalid Credentials");
    }
});
module.exports = router;