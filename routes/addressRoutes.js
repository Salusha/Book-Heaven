const express = require("express");
const {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/addressController.js");
const { isAuthenticatedUser } = require("../middlewares/auth.js");

const router = express.Router();

// Get all addresses
// POST new address
router
  .route("/")
  .get(isAuthenticatedUser, getAddresses)
  .post(isAuthenticatedUser, addAddress);

// Update / Delete address by ID
router
  .route("/:addressId")
  .put(isAuthenticatedUser, updateAddress)
  .delete(isAuthenticatedUser, deleteAddress);

// Set default address
router
  .route("/:addressId/set-default")
  .put(isAuthenticatedUser, setDefaultAddress);

module.exports = router;
