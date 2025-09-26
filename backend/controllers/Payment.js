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
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    plan_id,
  } = req.body;
  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !plan_id
  ) {
    console.log("Incomplete Data provided by RazorPay");
    return res
      .status(500)
      .json({ message: "Incomplete Data provided by RazorPay" });
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  // Generate the signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  // Compare signatures
  if (expectedSignature !== razorpay_signature) {
    console.log("Payment verification failed.");
    return res
      .status(400)
      .json({ status: "failure", message: "Payment verification failed." });
  }

  //now payment is successful, proceed to provide service from our end
  const provideService = async () => {
    const url = `${process.env.BACKEND_HOST}/buy_plan`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id: plan_id,
          payment: true,
          jwt: req.cookies.jwt,
        }),
        credentials: "include",
      });
      const responseData = await response.json();
      if (!response.ok) {
        //call razorpay for refund
        console.log(responseData.message);
        return res
          .status(response.status)
          .json({ message: responseData.message });
      }
      console.log(responseData.message);
      return res
        .status(response.status)
        .json({
          message: responseData.message,
          data: responseData.plandetails,
        });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  };
  provideService();
};
module.exports = { createOrder, getKey, verifyPayment };
