const express = require("express");
const router = express.Router();

const Order = require("../models/Order");

router.post("/order", async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.json({ message: "Order Saved", orderId: order._id, order });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error saving order" });
    }
});

// GET ORDERS BY USER EMAIL
router.get("/orders/:email", async (req, res) => {
    try {
        const orders = await Order.find({ userEmail: req.params.email });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET ALL ORDERS (Admin)
router.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;