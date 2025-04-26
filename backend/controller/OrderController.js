const mongoose = require("mongoose");
const OrderModel = require("../models/OrderModel");
const CartModel = require("../models/CartModel");
const UserModel = require("../models/UserModel"); // Import User Model
 // Import Cart Model

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

// Fetch orders for a specific farmer
const getFarmerOrders = async (req, res) => {
  try {
    const { farmerId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(farmerId)) {
      return res.status(400).json({ message: "Invalid farmerId format." });
    }

    // Check if the user exists and is a farmer
    const farmer = await UserModel.findOne({ _id: farmerId, userType: "farmer" });
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found or not authorized." });
    }

    // Fetch orders where storeId matches the farmerId
    const orders = await OrderModel.find({ storeId: farmerId })
      .populate("userId", "name email") // Populating user details
      .populate("items.productId", "name price") // Populating product details
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Orders fetched successfully", orders });
  } catch (error) {
    console.error("Error fetching farmer orders:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};




module.exports = { createOrder, getFarmerOrders };
