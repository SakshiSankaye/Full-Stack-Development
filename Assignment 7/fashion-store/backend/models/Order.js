const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userEmail: String,
    items: Array,
    total: Number,
    shippingDetails: {
        fullName: String,
        phone: String,
        address: String,
        city: String,
        pincode: String,
        paymentMethod: String
    },
    status: { type: String, default: "Pending" },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);