const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

// GET ALL PRODUCTS
router.get("/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).send(err);
    }
});

// ADD PRODUCT (for admin)
router.post("/product", async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.send("Product Added");
    } catch (err) {
        res.status(500).send(err);
    }
});

// GET PRODUCT BY ID
router.get("/product/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;