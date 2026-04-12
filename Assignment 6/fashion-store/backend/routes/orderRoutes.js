const express = require("express");
const router = express.Router();

const Order = require("../models/Order");

router.post("/order", async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.send("Order Saved");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error saving order");
    }
});

module.exports = router;