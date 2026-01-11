const catchAsyncErrors = require("../middlewares/catchAsyncErrors.js");
const Customer = require("../models/customerSchema.js");
const Feedback = require("../models/feedbackSchema.js");
const sendToken = require("../utils/jwtToken");
const { errorHandler } = require("../utils/errorHandler");
const responseHandler = require("../utils/responseHandler");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail, sendResetPasswordEmail } = require("./mailcontroller.js");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const saltRounds = 10;
const validator = require("validator");
const disposableEmailDomains = require("disposable-email-domains");

exports.registerCustomer = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // Validate email format
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .send(
          errorHandler(
            400,
            "Invalid request",
            "Please provide a valid email id"
          )
        );
    }

    // Check if email domain is disposable
    const domain = email.split("@")[1];
    if (disposableEmailDomains.includes(domain)) {
      return res
        .status(400)
        .send(
          errorHandler(
            400,
            "Invalid request",
            "Disposable email addresses are not allowed"
          )
        );
    }

    // Check if email already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res
        .status(400)
        .send(
          errorHandler(
            400,
            "Invalid request",
            "Email already registered. Please login or use a different email."
          )
        );
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
    const emailVerificationExpire = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create customer with unverified email
    const customer = await Customer.create({
      name,
      email,
      password,
      emailVerificationToken: hashedToken,
      emailVerificationExpire,
      emailVerified: false,
      avatar: {
        public_id: "This is Public ID",
        url: "ThisisSecureUrl",
      },
    });

    console.log("Customer created:", customer._id);
    console.log("Sending verification email to:", email);

    // Send verification email with unhashed token
    const emailSent = await sendVerificationEmail(email, verificationToken);
    console.log("Email send result:", emailSent);

    // Return success response without token
    res.status(201).json({
      success: true,
      message: "Registration successful! Please check your email to verify your account.",
      customer: {
        name: customer.name,
        email: customer.email,
        _id: customer._id,
        emailVerified: customer.emailVerified,
      },
    });
  } catch (error) {
    console.error("Error occurred during user registration:", error);
    next(error);
  }
});

// VERIFY EMAIL
exports.verifyEmail = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.query;

  if (!token) {
    return res
      .status(400)
      .send(
        errorHandler(
          400,
          "Invalid request",
          "Verification token is missing"
        )
      );
  }

  try {
    // Hash the token to compare with stored hashed token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const customer = await Customer.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpire: { $gt: Date.now() },
    });

    if (!customer) {
      return res
        .status(400)
        .send(
          errorHandler(
            400,
            "Invalid token",
            "Verification token is invalid or has expired"
          )
        );
    }

    // Mark email as verified
    customer.emailVerified = true;
    customer.emailVerificationToken = undefined;
    customer.emailVerificationExpire = undefined;
    await customer.save();

    // Generate JWT token for immediate login
    const jwtSecret = process.env.JWT_SECRET;
    const payload = {
      id: customer._id,
      name: customer.name,
      email: customer.email,
    };
    const authToken = jwt.sign(payload, jwtSecret);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully! You are now logged in.",
      token: authToken,
      customer: {
        name: customer.name,
        email: customer.email,
        _id: customer._id,
        emailVerified: customer.emailVerified,
      },
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    next(error);
  }
});

// DEBUG: VERIFY EMAIL BY EMAIL ADDRESS (Development Only)
exports.debugVerifyEmail = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .send(
        errorHandler(
          400,
          "Missing email",
          "Please provide an email address"
        )
      );
  }

  try {
    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res
        .status(404)
        .send(
          errorHandler(
            404,
            "User not found",
            "No user registered with this email"
          )
        );
    }

    // Mark email as verified
    customer.emailVerified = true;
    customer.emailVerificationToken = undefined;
    customer.emailVerificationExpire = undefined;
    await customer.save();

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    const payload = {
      id: customer._id,
      name: customer.name,
      email: customer.email,
    };
    const authToken = jwt.sign(payload, jwtSecret);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully! (DEBUG MODE)",
      token: authToken,
      customer: {
        name: customer.name,
        email: customer.email,
        _id: customer._id,
        emailVerified: customer.emailVerified,
      },
    });
  } catch (error) {
    console.error("Error in debug verify email:", error);
    next(error);
  }
});

// RESEND VERIFICATION EMAIL
exports.resendVerificationEmail = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  if (!email || !validator.isEmail(email)) {
    return res
      .status(400)
      .send(
        errorHandler(400, "Invalid request", "Please provide a valid email address")
      );
  }

  try {
    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res
        .status(404)
        .send(errorHandler(404, "User not found", "No user registered with this email"));
    }

    if (customer.emailVerified) {
      return res
        .status(400)
        .send(errorHandler(400, "Already verified", "This email is already verified"));
    }

    // Generate fresh token and expiry
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    customer.emailVerificationToken = hashedToken;
    customer.emailVerificationExpire = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await customer.save();

    const sent = await sendVerificationEmail(email, rawToken);
    if (!sent) {
      return res
        .status(500)
        .send(errorHandler(500, "Email failed", "Could not send verification email. Please try again later."));
    }

    return res.status(200).json({
      success: true,
      message: "Verification email resent. Please check your inbox.",
    });
  } catch (error) {
    console.error("Error resending verification email:", error);
    next(error);
  }
});

// CUSTOMER LOGIN ROUTE
exports.loginCustomer = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(404)
      .send(
        errorHandler(
          404,
          "Missing Parameters",
          "Please enter email and password"
        )
      );
  }

  const customer = await Customer.findOne({ email }).select("+password");

  if (!customer) {
    return res
      .status(404)
      .send(
        errorHandler(
          404,
          "Invalid Request",
          "Please enter valid email and password"
        )
      );
  }

  const isPasswordMatched = await customer.comparePassword(password);

  if (!isPasswordMatched) {
    return res
      .status(404)
      .send(errorHandler(404, "Bad Request", "Please enter valid password"));
  }

  // Check if email is verified
  if (!customer.emailVerified) {
    return res
      .status(403)
      .send(
        errorHandler(
          403,
          "Email not verified",
          "Please verify your email before logging in. Check your inbox for the verification link."
        )
      );
  }

  sendToken(customer, 200, res);
  const refreshToken = jwt.sign(
    { id: customer._id },
    process.env.REFRESH_TOKEN_SECRET
  );

  if (customer) {
    await Customer.findByIdAndUpdate(customer._id, { refreshToken });
  }

  const options = {
    expires: new Date(
      Date.now() + process.env.REFRESH_TOKEN_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(200).cookie("refreshToken", refreshToken, options).json({
    success: true,
    refreshToken,
    customer,
  });
});

//CUSTOMER LOGOUT ROUTE
exports.logoutCustomer = catchAsyncErrors(async (req, res, next) => {
  const customer = await Customer.findById(req.user.id);

  if (!customer) {
    return res
      .status(404)
      .send(errorHandler(404, "Bad Request", "Customer does not exists"));
  }
  const updatedCustomer = await Customer.findOneAndUpdate(
    { _id: req.user.id },
    { refreshToken: null },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("token", options)
    .clearCookie("refreshToken", options)
    .json({
      success: true,
    });
});

// GET CUSTOMER DETAIL
exports.getCustomerDetails = catchAsyncErrors(async (req, res, next) => {
  const customer = await Customer.findById(req.user.id);

  return res.status(200).send({
    response: {
      data: { customer },
      title: "Customer Fetched",
      message: "Customer Fetched Successfully!",
      status: 200,
    },
    errors: {},
  });
});

// UPDATE CUSTOMER PASSWORD
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const customer = await Customer.findById(req.user.id).select("+password");

  const isPasswordMatched = await customer.comparePassword(
    req.body.oldPassword
  );

  if (!isPasswordMatched) {
    return res
      .status(404)
      .send(
        errorHandler(404, "Bad Request", "Please enter the correct password")
      );
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return res
      .status(404)
      .send(errorHandler(404, "Bad Request", "Password do not match"));
  }

  customer.password = req.body.newPassword;

  await customer.save();

  sendToken(customer, 200, res);
});

// UPDATE CUSTOMER PROFILE
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newCustomerData = {
    name: req.body.name,
    email: req.body.email,
  };

  const customer = await Customer.findByIdAndUpdate(
    req.user.id,
    newCustomerData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  return res.status(200).send({
    response: {
      data: {},
      title: "Profile Updated",
      message: "Customer's Profile Updated Successfully!",
      status: 200,
    },
    errors: {},
  });
});


// Move the resetPassword function outside and export it
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  if (!email || !validator.isEmail(email)) {
    return res
      .status(400)
      .send(
        errorHandler(400, "Invalid request", "Please provide a valid email address")
      );
  }

  try {
    const customer = await Customer.findOne({ email });

    if (!customer) {
      // For security, don't reveal if user exists
      return res.status(200).json({
        success: true,
        message: "If an account exists with this email, you will receive password reset instructions.",
      });
    }

    // Generate reset token (1 hour expiry)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const resetExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store hashed token in DB
    customer.resetPasswordToken = hashedToken;
    customer.resetPasswordExpire = resetExpire;
    await customer.save();

    console.log("📧 Sending reset password email to:", email);

    // Send reset email with unhashed token
    const emailSent = await sendResetPasswordEmail(email, resetToken);

    if (!emailSent) {
      // Clear tokens if email fails
      customer.resetPasswordToken = undefined;
      customer.resetPasswordExpire = undefined;
      await customer.save();

      return res
        .status(500)
        .send(
          errorHandler(
            500,
            "Email failed",
            "Could not send reset email. Please try again later."
          )
        );
    }

    return res.status(200).json({
      success: true,
      message: "If an account exists with this email, you will receive password reset instructions.",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    next(error);
  }
});

// RESET PASSWORD CONFIRMATION (from email link)
exports.resetPasswordConfirm = catchAsyncErrors(async (req, res, next) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .send(
        errorHandler(400, "Invalid request", "Token and new password are required")
      );
  }

  if (newPassword.length < 8) {
    return res
      .status(400)
      .send(
        errorHandler(400, "Invalid request", "Password must be at least 8 characters")
      );
  }

  try {
    // Hash the token to compare with stored hashed token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const customer = await Customer.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!customer) {
      return res
        .status(400)
        .send(
          errorHandler(
            400,
            "Invalid token",
            "Password reset token is invalid or has expired"
          )
        );
    }

    // Update password
    customer.password = newPassword;
    customer.resetPasswordToken = undefined;
    customer.resetPasswordExpire = undefined;
    await customer.save();

    console.log("✅ Password reset for:", customer.email);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully! Please login with your new password.",
    });
  } catch (error) {
    console.error("Error in resetPasswordConfirm:", error);
    next(error);
  }
});


exports.addFeedback = catchAsyncErrors(async (req, res, next) => {
  const { feedback, topic } = req.body;
  const newFeedback = await Feedback.create({
    feedback,
    topic,
    user: req.user._id,
  });
  try {
    // sendMailToAdmin(newFeedback);
    return res.status(200).send({
      response: {
        data: { newFeedback },
        title: "Feedback Added",
        message: "Feedback Added Successfully!",
        status: 200,
      },
      errors: {},
    });
  } catch (error) {
    newFeedback.delete();
    console.error("Error occurred during feedback creation:", error);
    next(error);
  }
});
// sendMailToAdmin = async (newFeedback) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.SMTP_EMAIL,
//       pass: process.env.SMTP_PASSWORD,
//     },
//   });
//   const mailOptions = {
//     from: process.env.SMTP_EMAIL,
//     to: "admin email",
//     subject: "New Feedback",
//     text: `New Feedback received from ${newFeedback.user}`,
//   };
// };

exports.exchangeToken = catchAsyncErrors(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return next(new ErrorHandler("Refresh token is required", 400));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const customer = await Customer.findById(decoded.id);

    if (!customer || customer.refreshToken !== refreshToken) {
      return res
        .status(401)
        .send(errorHandler(401, "Invalid Request", "Invalid Refresh Token"));
    }

    const accessToken = customer.getJWTToken();

    const newRefreshToken = jwt.sign(
      { id: customer._id },
      process.env.REFRESH_TOKEN_SECRET
    );

    const updatedCustomer = await Customer.findByIdAndUpdate(customer._id, {
      refreshTOken: newRefreshToken,
    });

    const accessTokenOptions = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    const refreshTokenOptions = {
      expires: new Date(
        Date.now() +
          process.env.REFRESH_TOKEN_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    res.cookie("accessToken", accessToken, accessTokenOptions);
    res.cookie("refreshToken", newRefreshToken, refreshTokenOptions);

    return res.status(200).send({
      response: {
        data: { accessToken, refreshToken },
        title: "Tokens Fetched",
        message: "Tokens Fetched Successfully!",
        status: 200,
      },
      errors: {},
    });
  } catch (error) {
    return res
      .status(401)
      .send(errorHandler(401, "Invalid Request", "Invalid Refresh Token"));
  }
});
