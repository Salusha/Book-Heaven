const catchAsyncErrors = require("../middlewares/catchAsyncErrors.js");
const Address = require("../models/addressSchema.js");

// Get all addresses for the logged-in user
exports.getAddresses = catchAsyncErrors(async (req, res) => {
  let doc = await Address.findOne({ user_id: req.user._id });

  if (!doc) {
    doc = await Address.create({
      user_id: req.user._id,
      addresses: [],
    });
  }

  return res.status(200).send({
    response: {
      data: { addresses: doc.addresses },
      title: "Addresses Fetched",
      message: "Addresses fetched successfully",
      status: 200,
    },
    errors: {},
  });
});

// Add address
exports.addAddress = catchAsyncErrors(async (req, res) => {
  const { fullName, phone, address, city, state, zipCode, isDefault } = req.body;

  let doc = await Address.findOne({ user_id: req.user._id });
  if (!doc) {
    doc = await Address.create({
      user_id: req.user._id,
      addresses: [],
    });
  }

  // If new address is default → unset others
  if (isDefault === true) {
    doc.addresses.forEach((a) => (a.isDefault = false));
  }

  doc.addresses.push({
    fullName,
    phone,
    address,
    city,
    state,
    zipCode,
    isDefault: Boolean(isDefault),
  });

  await doc.save();

  return res.status(201).send({
    response: {
      data: { addresses: doc.addresses },
      title: "Address Added",
      message: "Address added successfully",
      status: 201,
    },
    errors: {},
  });
});

// Update address
exports.updateAddress = catchAsyncErrors(async (req, res) => {
  const { addressId } = req.params;
  const { fullName, phone, address, city, state, zipCode, isDefault } = req.body;

  const doc = await Address.findOne({ user_id: req.user._id });
  if (!doc) {
    return res.status(404).send({
      response: {},
      errors: { message: "No addresses found" },
    });
  }

  const addr = doc.addresses.id(addressId);
  if (!addr) {
    return res.status(404).send({
      response: {},
      errors: { message: "Address not found" },
    });
  }

  // If setting this as default → unset others
  if (isDefault === true) {
    doc.addresses.forEach((a) => (a.isDefault = false));
  }

  if (fullName !== undefined) addr.fullName = fullName;
  if (phone !== undefined) addr.phone = phone;
  if (address !== undefined) addr.address = address;
  if (city !== undefined) addr.city = city;
  if (state !== undefined) addr.state = state;
  if (zipCode !== undefined) addr.zipCode = zipCode;
  if (isDefault !== undefined) addr.isDefault = isDefault;

  await doc.save();

  return res.status(200).send({
    response: {
      data: { addresses: doc.addresses },
      title: "Address Updated",
      message: "Address updated successfully",
      status: 200,
    },
    errors: {},
  });
});

// Delete address
exports.deleteAddress = catchAsyncErrors(async (req, res) => {
  const { addressId } = req.params;

  const doc = await Address.findOne({ user_id: req.user._id });
  if (!doc) {
    return res.status(404).send({
      response: {},
      errors: { message: "No addresses found" },
    });
  }

  const addr = doc.addresses.id(addressId);
  if (!addr) {
    return res.status(404).send({
      response: {},
      errors: { message: "Address not found" },
    });
  }

  const wasDefault = addr.isDefault;
  doc.addresses.pull(addressId);

  // If default was deleted → make first address default
  if (wasDefault && doc.addresses.length > 0) {
    doc.addresses[0].isDefault = true;
  }

  await doc.save();

  return res.status(200).send({
    response: {
      data: { addresses: doc.addresses },
      title: "Address Deleted",
      message: "Address deleted successfully",
      status: 200,
    },
    errors: {},
  });
});

// Set default address
exports.setDefaultAddress = catchAsyncErrors(async (req, res) => {
  const { addressId } = req.params;

  const doc = await Address.findOne({ user_id: req.user._id });
  if (!doc) {
    return res.status(404).send({
      response: {},
      errors: { message: "No addresses found" },
    });
  }

  const target = doc.addresses.id(addressId);
  if (!target) {
    return res.status(404).send({
      response: {},
      errors: { message: "Address not found" },
    });
  }

  doc.addresses.forEach((a) => (a.isDefault = false));
  target.isDefault = true;

  await doc.save();

  return res.status(200).send({
    response: {
      data: { addresses: doc.addresses },
      title: "Default Address Set",
      message: "Default address set successfully",
      status: 200,
    },
    errors: {},
  });
});
