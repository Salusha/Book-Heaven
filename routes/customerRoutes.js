const express = require("express");
const {
  registerCustomer,
  loginCustomer,
  getCustomerDetails,
  updatePassword,
  updateProfile,
  logoutCustomer,
  addFeedback,
  resetPassword,
  resetPasswordConfirm,
  verifyEmail,
  debugVerifyEmail,
  resendVerificationEmail,
} = require("../controllers/customerController.js");
const {
  addTocart,
  getCartItems,
  deleteCartItem,
} = require("../controllers/cartController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth.js");

const router = express.Router();

// Authentication Routes
router.post("/register", registerCustomer);
router.get("/verify-email", verifyEmail);
router.post("/debug/verify-email", debugVerifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.post("/login", loginCustomer);
router.post("/logout", isAuthenticatedUser, logoutCustomer);

// Customer Profile Routes
router.get("/me", isAuthenticatedUser, getCustomerDetails);
router.put("/password/update", isAuthenticatedUser, updatePassword);
router.put("/me/update", isAuthenticatedUser, updateProfile);
router.post("/resetpassword", resetPassword);
router.post("/reset-password-confirm", resetPasswordConfirm);

// Cart Routes
// Instead of sending user as req parameter we can send user id
router.post("/cart/add-product", isAuthenticatedUser, addTocart);
router.delete("/cart/remove-product", isAuthenticatedUser, deleteCartItem);
router.get("/cart", isAuthenticatedUser, getCartItems);

// Giving feedback
router.post("/add-feedback", isAuthenticatedUser, addFeedback);

module.exports = router;

