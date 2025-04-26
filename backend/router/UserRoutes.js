const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController');
const orderController = require('../controller/OrderController');
// add a new product
router.post('/add', userController.addProduct);
router.get('/getprods', userController.getAllProducts);
// add to cart
router.post('/addtocart', userController.addToCart);
router.post('/getcart', userController.getCart);
router.post('/removecart', userController.removeFromCart);
router.post('/addquantity', userController.updateCartQuantity)
// create order
router.post('/create', orderController.createOrder);
// get orders for farmer
router.get('/farmerorders', orderController.getFarmerOrders);
//get acc details
router.post('/acc', userController.getAccountDetails);
//add address
router.post('/address', userController.addAddress);



module.exports = router;
