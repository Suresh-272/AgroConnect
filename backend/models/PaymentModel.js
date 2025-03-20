const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    paymentId: { type: String },
    signature: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
