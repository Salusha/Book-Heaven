const express = require("express");
const router = express.Router();
const { addTocart, getCartItems, deleteCartItem } = require("../controllers/cartController");
const { isAuthenticatedUser } = require("../middlewares/auth");

// Fetch cart data
router.get("/", isAuthenticatedUser, getCartItems);

// Add item to cart
router.post("/", isAuthenticatedUser, addTocart);

// Remove item from cart
router.post("/remove-product", isAuthenticatedUser, deleteCartItem);

module.exports = router;
