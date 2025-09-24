const express = require("express");
const router = express.Router();
const Payment = require("../controllers/Payment");
router.route("/createOrder").post(Payment.createOrder);
router.route("/getKey").get(Payment.getKey);
router.route("/verify_payment").post(Payment.verifyPayment);

module.exports = router;
