const Product = require("../models/productSchema.js");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors.js");
// const errorHandler = require("../utils/errorHandler");
const { errorHandler } = require("../utils/errorHandler");
const responseHandler = require("../utils/responseHandler");

// CREATE PRODUCT
// exports.createProduct = catchAsyncErrors(async (req, res, next) => {
//   const product = await Product.create(req.body);

//   await product.save();
//   const { url } = req.body;
//   if (url) {
//     product.shareableLink = url;
//     await product.save();
//   }

//   return res.status(200).send({
//     response: {
//       data: { product },
//       title: "Product Created",
//       message: "Product Created Successfully!",
//       status: 200,
//     },
//     errors: {},
//   });
// });
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  const {
    name,
    description,
    author,
    price,
    category,
    Stock,
    images,
    url // this becomes shareableLink
  } = req.body;

  if (!url) {
    return res.status(400).send({
      response: {},
      errors: {
        status: 400,
        title: "Bad Request",
        detail: "Please provide a shareable URL for the product."
      }
    });
  }

  const product = await Product.create({
    name,
    description,
    author,
    price,
    category,
    Stock,
    images, // must be array of { public_id, url }
    shareableLink: url, // ✅ maps to required `shareableLink`
    user: req.user._id   // ✅ required by schema
  });

  return res.status(200).send({
    response: {
      data: { product },
      title: "Product Created",
      message: "Product Created Successfully!",
      status: 200,
    },
    errors: {},
  });
});


// GET ALL PRODUCTS (ADMIN)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  return res.status(200).send({
    response: {
      data: { products },
      title: "Product Fetched",
      message: "Product Fetched Successfully!",
      status: 200,
    },
    errors: {},
  });
});

// GET PRODUCT DETAILS
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res
      .status(404)
      .send(errorHandler(404, "Not Found", "Product Not Found"));
  }

  return res.status(200).send({
    response: {
      data: { product },
      title: "Product Fetched",
      message: "Product Fetched Successfully!",
      status: 200,
    },
    errors: {},
  });
});

// UPDATE PRODUCT -- ADMIN

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res
      .status(404)
      .send(errorHandler(404, "Not Found", "Product Not Found"));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  return res.status(200).send({
    response: {
      data: { product },
      title: "Product Fetched",
      message: "Product Fetched Successfully!",
      status: 200,
    },
    errors: {},
  });
});

// DELETE PRODUCT

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res
      .status(404)
      .send(errorHandler(404, "Not Found", "Product Not Found"));
  }

  await product.deleteOne();

  return res.status(200).send({
    response: {
      data: { product },
      title: "Product Deleted",
      message: "Product Deleted Successfully!",
      status: 200,
    },
    errors: {},
  });
});

// Search Product

exports.searchProduct = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.findById(req.params.id);

  if (!products) {
    return res
      .status(404)
      .send(errorHandler(404, "Not Found", "Product Not Found"));
  }
  res.status(200).json({
    success: true,
    products,
  });
});

// Filter Product

exports.filterProduct = catchAsyncErrors(async (req, res, next) => {
  // console.log("🔍 /api/product route hit");
  const { category, numOfReviews } = req.query;
  if (!category || !numOfReviews) {
    return res
      .status(404)
      .send(
        errorHandler(
          404,
          "Invalid Request",
          "Please select either category or numOfReviews"
        )
      );
  }

  let filterCriteria = {};
  if (category) {
    filterCriteria.category = category;
  } else if (numOfReviews) {
    filterCriteria.numOfReviews = numOfReviews;
  }
  const products = await Product.find(filterCriteria);
  if (!products) {
    return res
      .status(404)
      .send(errorHandler(404, "Not Found", "Product Not Found"));
  }
  res.status(200).json({
    success: true,
    products,
  });
});

exports.getShareableLink = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    const shareableLink = product.shareableLink;
    res.json({ success: true, shareableLink });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// GET ALL PRODUCTS - SIMPLE FORMAT
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

