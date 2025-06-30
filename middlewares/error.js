// // const ErrorHandler = require("../utils/errorHandler.js");
// const { errorHandler } = require("../utils/errorHandler.js");

// module.exports = (err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.message = err.message || "Internal Server Error";

//   // Handle undefined payload error
//   if (err.message === "payload is not defined") {
//     const message = "Payload is not defined";
//     err = new ErrorHandler(message, 500);
//   }

//   // Handle undefined jwtSecret error
//   if (err.message === "jwtSecret is not defined") {
//     const message = "JWT secret key is not defined";
//     err = new ErrorHandler(message, 500);
//   }

//   // Wrong Mongodb Id error
//   if (err.name === "CastError") {
//     const message = `Resource not found. Invalid: ${err.path}`;
//     err = new ErrorHandler(message, 400);
//   }

//   // Mongoose duplicate key error
//   if (err.code === 11000) {
//     const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
//     err = new ErrorHandler(message, 400);
//   }

//   // Wrong JWT error
//   if (err.name === "JsonWebTokenError") {
//     const message = `Json Web Token is invalid, Try again `;
//     err = new ErrorHandler(message, 400);
//   }

//   // JWT EXPIRE error
//   if (err.name === "TokenExpiredError") {
//     const message = `Json Web Token is Expired, Try again `;
//     err = new ErrorHandler(message, 400);
//   }

//   if (!res.headersSent) {
//     return res.status(err.statusCode).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

const { errorHandler } = require("../utils/errorHandler.js");

module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  let title = "Internal Server Error";
  let detail = err.message || "Something went wrong";

  // Custom handling
  if (err.name === "CastError") {
    title = "Invalid Resource Identifier";
    detail = `Resource not found. Invalid: ${err.path}`;
  } else if (err.code === 11000) {
    title = "Duplicate Field";
    detail = `Duplicate ${Object.keys(err.keyValue)} entered`;
  } else if (err.name === "JsonWebTokenError") {
    title = "Invalid Token";
    detail = "Json Web Token is invalid, try again.";
  } else if (err.name === "TokenExpiredError") {
    title = "Token Expired";
    detail = "Json Web Token has expired, try again.";
  }

  if (!res.headersSent) {
    return res.status(statusCode).json(
      errorHandler(statusCode, title, detail)
    );
  }
};
