const express = require("express");
const {
  createProduct,
  getAdminProducts,
  getProductDetails,
  getShareableLink,//it was missing causing error
  updateProduct,
  deleteProduct,
  searchProduct,
  filterProduct,
  getAllProducts
} = require("../controllers/productController.js");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"),createProduct);

  router
  .route("/admin/products")
  .get(getAdminProducts);

  router.route("/product/:id").get(getProductDetails);

  router.route("/producturl/:id").get(getShareableLink);

  router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);



  router.route("/product/search/:id").get(searchProduct);
  router.route("/product").get(filterProduct);
  router.route("/products").get(getAllProducts); // for frontend browse

  
  module.exports = router;

