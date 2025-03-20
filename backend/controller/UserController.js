const Product = require('../models/ProductModel');
const Cart = require('../models/CartModel');
const UserModel = require("../models/UserModel");
const OrderModel = require("../models/OrderModel");
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
const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        let cart = await Cart.findOne({ userId });
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (!cart) {
            cart = new Cart({ userId, items: [], totalPrice: 0 });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        // Calculate total price dynamically
        let totalPrice = 0;
        for (let item of cart.items) {
            const itemProduct = await Product.findById(item.productId);
            if (itemProduct) {
                totalPrice += itemProduct.price * item.quantity;
            }
        }
        cart.totalPrice = totalPrice;

        await cart.save();
        
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
  
// Get Cart
const getCart = async (req, res) => {
    try {
        const { userId } = req.body;
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        
        // Calculate total price dynamically
        let totalPrice = 0;
        for (let item of cart.items) {
            if (item.productId) {
                totalPrice += item.productId.price * item.quantity;
            }
        }
        cart.totalPrice = totalPrice;
        await cart.save();
        
        res.json(cart);
    } catch (error) {
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

        let cartItem = await Cart.findOne({ userId, "items.productId": productId });

        if (!cartItem) {
            return res.status(404).json({ error: "Product not found in cart" });
        }

        const itemIndex = cartItem.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ error: "Product not found in cart" });
        }

        // Update quantity based on action
        if (action === "increase") {
            cartItem.items[itemIndex].quantity += 1;
        } else if (action === "decrease") {
            if (cartItem.items[itemIndex].quantity > 1) {
                cartItem.items[itemIndex].quantity -= 1;
            } else {
                // Remove item if quantity is 0
                cartItem.items.splice(itemIndex, 1);
            }
        }

        // Calculate total price dynamically
        let totalPrice = 0;
        for (let item of cartItem.items) {
            const product = await Product.findById(item.productId);
            if (product) {
                totalPrice += product.price * item.quantity;
            }
        }
        cartItem.totalPrice = totalPrice;

        await cartItem.save();

        return res.json({ message: "Cart updated successfully", cart: cartItem });
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

        // Find index of the product in cart
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ error: "Product not found in cart" });
        }

        // Remove item from cart
        cart.items.splice(itemIndex, 1);

        // Calculate total price dynamically
        let totalPrice = 0;
        for (let item of cart.items) {
            const product = await Product.findById(item.productId);
            if (product) {
                totalPrice += product.price * item.quantity;
            }
        }
        cart.totalPrice = totalPrice;

        await cart.save();
        res.json({ message: "Product removed from cart", cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

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
