const mongoose = require("mongoose");
const OrderModel = require("../models/OrderModel");
const CartModel = require("../models/CartModel"); // Import Cart Model

// Generate unique order ID
const generateUniqueOrderId = () => `ORDER_${Date.now()}`;

// Create Order (Called after successful payment)
const createOrder = async (req, res) => {
  try {
    const { userId, storeId, items, amount, paymentStatus } = req.body;

    console.log("Incoming Order Data:", req.body);

    // Validate required fields
    if (!userId || !storeId || !items?.length || !amount || !paymentStatus) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Validate `userId` and `storeId` as ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(storeId)) {
      return res.status(400).json({ message: "Invalid userId or storeId format." });
    }

    const orderId = generateUniqueOrderId();

    // Create new order
    const newOrder = await OrderModel.create({
      userId,
      storeId,
      items,
      amount,
      orderId,
      paymentStatus,
    });

    // 🛒 Empty the cart after successful order creation
    await CartModel.deleteMany({ userId });

    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports = { createOrder };
