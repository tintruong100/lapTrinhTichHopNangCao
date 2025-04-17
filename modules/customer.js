const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    id: Number,
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);