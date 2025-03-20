const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/PaymentModel");
require("dotenv").config();

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ✅ **1. Create Order**
const createOrder = async (req, res) => {
    try {
        const { amount, currency} = req.body;

        const options = {
            amount: amount * 100, // Convert to paise
            currency,
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1 // Auto capture
        };

        const order = await razorpay.orders.create(options);

        // Save order details in database
        const payment = new Payment({
            orderId: order.id,
            amount,
            currency,
            status: "pending"
        });

        await payment.save();

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ **2. Verify Payment**
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const payment = await Payment.findOne({ orderId: razorpay_order_id });

        if (!payment) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            payment.paymentId = razorpay_payment_id;
            payment.signature = razorpay_signature;
            payment.status = "success";
            await payment.save();

            res.status(200).json({ success: true, message: "Payment Verified" });
        } else {
            payment.status = "failed";
            await payment.save();
            res.status(400).json({ success: false, message: "Invalid Payment Signature" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createOrder, verifyPayment };
