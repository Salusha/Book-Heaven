const express = require("express");
const { subscribeEmail } = require("../controllers/subscriptionController");

const router = express.Router();

router.post("/", subscribeEmail);

module.exports = router;
