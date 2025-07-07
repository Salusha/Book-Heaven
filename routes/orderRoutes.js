const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  updateOrder,
  deleteOrder
} = require("../controllers/orderController");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth.js");

router.route("/new").post(isAuthenticatedUser, newOrder);

router.route("/:id").get(isAuthenticatedUser, getSingleOrder);

router.route("/orders/me").get(isAuthenticatedUser, myOrders);

router
  .route("/admin/order/:id")
  .put(updateOrder)
  .delete(deleteOrder);

module.exports = router;