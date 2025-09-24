const Razorpay = require("razorpay");
const crypto = require("crypto");
const createOrder = async (req, res) => {
  const { amount } = req.body;
  if (!amount) {
    return res.status(404).json({ message: "missing amount" });
  }
  try {
    var instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    if (!instance) {
      console.log("Unable to make connection with RazorPay");
      return res
        .status(502)
        .json({ message: "Unable to make connection with RazorPay" });
    }

    const options = {
      amount: parseInt(amount) * 100,
      currency: "INR",
    };
    const order = await instance.orders.create(options);
    if (!order) {
      console.log("Unable to create Order on RazorPay");
      return res
        .status(502)
        .json({ message: "Unable to create Order on RazorPay" });
    }
    console.log("Order created Successfully");
    return res.status(200).json({
      message: "Order created Successfully",
      status: true,
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
const getKey = async (req, res) => {
  try {
    console.log("Successfully sended key");
    return res.status(200).json({
      message: "Successfully received key",
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature);

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  // Generate the signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  // Compare signatures
  if (expectedSignature === razorpay_signature) {
    // Payment is successful and verified.
    // You can now update your database and fulfill the order.
    res
      .status(200)
      .json({ status: "success", message: "Payment verified successfully." });
  } else {
    // Signature mismatch - potential fraud.
    res
      .status(400)
      .json({ status: "failure", message: "Payment verification failed." });
  }
};
module.exports = { createOrder, getKey, verifyPayment };
