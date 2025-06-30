// const ErrorHandler = require("../utils/errorHandler.js");
const { errorHandler } = require("../utils/errorHandler.js");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const Customer = require("../models/customerSchema.js");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const token = req.headers["auth-token"];

  // if (!token) {
  //   // return next(new ErrorHandler("Please Login to access this resource", 401));
  //   const { errorHandler } = require("../utils/errorHandler.js");
  //   return res.status(401).send(errorHandler(401, "Unauthorized", "Please login to access this resource"));

  // }
  if (!token) {
  return res.status(401).send(
    errorHandler(401, "Unauthorized", "Please login to access this resource")
  );
}


  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  // req.user = await Customer.findById(decodedData.id);
  const user = await Customer.findById(decodedData.id);
  if (!user) {
    return res.status(401).send(
      errorHandler(401, "Unauthorized", "User not found")
    );
  }

  req.user = user;
  console.log("verified successfully");

  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)){
      return res.status(403).send(
        errorHandler(
          403,
          "Forbidden",
          `Role: ${req.user?.role || "Unknown"} is not allowed to access this resource`
        )
      );
    }

    next();
  };
};
