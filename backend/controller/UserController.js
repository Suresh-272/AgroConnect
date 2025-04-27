const Product = require('../models/ProductModel');
const Cart = require('../models/CartModel');
const UserModel = require("../models/UserModel");
const OrderModel = require("../models/OrderModel");
const axios = require('axios');
// Add a new product
const addProduct = async (req, res) => {
    try {
        const { name, price, unit, description, category, image } = req.body;
        if (!unit) {
            return res.status(400).json({ error: "Unit is required (e.g., kg, liter, piece)" });
        }

        const newProduct = new Product({ name, price, unit, description, category, image });
        await newProduct.save();
        res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add to Cart
// Function to fetch the predicted price from Python API
const fetchPredictedPrice = async (commodityName) => {
    try {
      const response = await axios.get(`http://172.20.10.5:5000/api/commodity/${commodityName.toLowerCase()}`);
      return response.data.current_price;
    } catch (error) {
      console.error(`Error fetching prediction for ${commodityName}:`, error);
      return null;
    }
  };
  
  // Add to Cart
const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Fetch predicted price
    const predictedPrice = await fetchPredictedPrice(product.name.toLowerCase());
    if (predictedPrice === null) return res.status(500).json({ message: 'Failed to fetch predicted price' });

    if (!cart) {
      cart = new Cart({ userId, items: [], totalPrice: 0 });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].price = predictedPrice; // Update predicted price if needed
    } else {
      cart.items.push({
        productId,
        quantity,
        price: predictedPrice,
      });
    }

    // Calculate total price based on cart item prices
    cart.totalPrice = parseFloat(
      cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
    );

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error('Error in addToCart:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get Cart
const getCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    let totalPrice = 0;

    // Fetch updated predicted prices for all products in the cart
    for (let item of cart.items) {
      if (item.productId) {
        const predictedPrice = await fetchPredictedPrice(item.productId.name);
        if (predictedPrice !== null) {
          item.price = predictedPrice; // Update item's price with the latest predicted price
        }
      }
      totalPrice += item.price * item.quantity; // Use updated price for total calculation
    }

    cart.totalPrice = parseFloat(totalPrice.toFixed(2));

    await cart.save(); // Save updated prices
    res.json(cart);
  } catch (error) {
    console.error('Error in getCart:', error);
    res.status(500).json({ error: error.message });
  }
};


// Update Cart Item Quantity
const updateCartQuantity = async (req, res) => {
  try {
    const { userId, productId, action } = req.body;

    if (!userId || !productId || !action) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    if (action === "increase") {
      cart.items[itemIndex].quantity += 1;
    } else if (action === "decrease") {
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
      } else {
        cart.items.splice(itemIndex, 1);
      }
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    // Calculate total price based on stored item.price
    cart.totalPrice = parseFloat(
      cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
    );

    await cart.save();
    return res.json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Remove from Cart
const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    cart.items.splice(itemIndex, 1);

    // Calculate total price based on stored item.price
    cart.totalPrice = parseFloat(
      cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
    );

    await cart.save();
    res.json({ message: "Product removed from cart", cart });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ error: error.message });
  }
};


// get acc details
const getAccountDetails = async (req, res) => {
    try {
      const { userId } = req.body;
  
      // Validate userId
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
  
      const user = await UserModel.findById(userId).select("name email userType addresses");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Fetch order details
      const totalOrders = await OrderModel.countDocuments({ userId });
      const pendingOrders = await OrderModel.countDocuments({ userId, paymentStatus: "Pending" });
  
      // Calculate user rating (Mocked as static for now)
      const userRating = 4.8; // Replace with actual logic if needed
  
      res.status(200).json({
        name: user.name,
        email: user.email,
        userType: user.userType,
        addresses: user.addresses,
        totalOrders,
        pendingOrders,
        rating: userRating,
      });
    } catch (error) {
      console.error("Error fetching account details:", error);
      res.status(500).json({ message: "Internal Server Error", error });
    }
  };

// ➤ Add address with GPS validation
const addAddress = async (req, res) => {
    try {
      const { userId, type, address, latitude, longitude, landmark } = req.body;
  
      // Validate required fields
      if (!userId || !type || !address || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      // Validate latitude & longitude range
      if (
        latitude < -90 || latitude > 90 ||
        longitude < -180 || longitude > 180
      ) {
        return res.status(400).json({ message: "Invalid GPS coordinates" });
      }
  
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Create new address object
      const newAddress = {
        type,
        address,
        latitude,
        longitude,
        landmark: landmark || null,
        timestamp: new Date(),
      };
  
      // Add to user’s address list
      user.addresses.push(newAddress);
      await user.save();
  
      res.status(201).json({ message: "Address added successfully", address: newAddress });
    } catch (error) {
      console.error("Error adding address:", error);
      res.status(500).json({ message: "Internal Server Error", error });
    }
  };
  

module.exports = {
    addProduct,
    getAllProducts,
    addToCart,
    getCart,
    removeFromCart,
    updateCartQuantity,
    getAccountDetails,
    addAddress
};
