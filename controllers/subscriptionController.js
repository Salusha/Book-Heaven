const Subscription = require("../models/subscriptionSchema");
const Customer = require("../models/customerSchema");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors.js");
const { errorHandler } = require("../utils/errorHandler");
const validator = require("validator");

exports.subscribeEmail = catchAsyncErrors(async (req, res) => {
  const { email } = req.body || {};

  if (!email || !validator.isEmail(email)) {
    return res
      .status(400)
      .json(errorHandler(400, "Invalid email", "Please provide a valid email address."));
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Check if this email is a registered customer and verified
  const customer = await Customer.findOne({ email: normalizedEmail });
  const isVerifiedUser = !!(customer && customer.emailVerified);

  const existing = await Subscription.findOne({ email: normalizedEmail });
  if (existing) {
    if (existing.isUser !== isVerifiedUser) {
      existing.isUser = isVerifiedUser;
      await existing.save();
    }
    return res.status(200).json({ success: true, message: "You are already subscribed." });
  }

  await Subscription.create({
    email: normalizedEmail,
    isUser: isVerifiedUser,
  });

  return res.status(201).json({ success: true, message: "Subscribed successfully!" });
});
