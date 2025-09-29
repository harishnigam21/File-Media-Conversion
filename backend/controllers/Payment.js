const Razorpay = require("razorpay");
const crypto = require("crypto");
const prisma = require("../shortcut/prisma_initilization");
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
    const cookies = req.cookies;
    if (!cookies || !cookies.jwt) {
      return res.status(404).json({ message: "Missing Important cookies" });
    }
    const validUser = await prisma.users.findUnique({
      where: { reference_token: cookies.jwt },
    });
    if (!validUser) {
      return res.status(401).json({ message: "You are not authorized user" });
    }
    console.log("Successfully sended key");
    return res.status(200).json({
      message: "Successfully received key",
      key: process.env.RAZORPAY_KEY_ID,
      user: {
        email: validUser.email,
        name:
          validUser.first_name + validUser.middle_name + validUser.last_name,
        contact: [validUser.mobile_no],
      },
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
    amount_in_paise_to_refund,
  } = req.body;
  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !plan_id ||
    !amount_in_paise_to_refund
  ) {
    console.log("Incomplete Data provided by RazorPay");
    return res
      .status(500)
      .json({ message: "Incomplete Data provided by RazorPay" });
  }
  const cookies = req.cookies;
  if (!cookies || !cookies.jwt) {
    return res.status(404).json({ message: "Missing Important cookies" });
  }
  let validUser = null;
  const issueRefund = async () => {
    try {
      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const refundRequest = {
        amount: amount_in_paise_to_refund,
        speed: "optimum",
        notes: { reason: "Failed to provision service post-payment." },
      };

      const refund = await instance.payments.refund(
        razorpay_pament_id,
        refundRequest
      );

      const createRefundUser = await prisma.refundUser.create({
        data: {
          refund_id: refund.id,
          plan_id: plan_id,
          amount: amount_in_paise_to_refund,
          email: validUser.email,
          refund_status: "resolved",
        },
      });
      if (!createRefundUser) {
        console.log(
          "createRefundUser : Refund is initiated, but Unable to keep record at DB"
        );
      }

      console.log("Razorpay Refund initiated successfully:", refund.id);
      return res.status(417).json({
        success: true,
        refundId: refund.id,
        message:
          "Sorry for inconvenience, we failed to provide service, your refund is initiated from our side.",
      });
    } catch (error) {
      console.error("Error initiating Razorpay refund:", error.message);
      const createRefundUser = await prisma.refundUser.create({
        data: {
          refund_id: refund.id,
          plan_id: plan_id,
          amount: amount_in_paise_to_refund,
          email: validUser.email,
          refund_status: `pending : ${error.message}`,
        },
      });
      if (!createRefundUser) {
        console.log(
          "createRefundUser : Refund is initiated, but Unable to keep record at DB"
        );
      }
      return res.status(500).json({ success: false, message: error.message });
    }
  };
  try {
    validUser = await prisma.users.findUnique({
      where: { reference_token: cookies.jwt },
    });
    if (!validUser) {
      console.log("Unknown User");
      return res.status(401).json({ message: "You are not authorized User" });
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
            jwt: cookies.jwt,
            razorpay_payment_id,
          }),
          credentials: "include",
        });
        const responseData = await response.json();
        if (!response.ok) {
          console.log(responseData.message);

          //payment is successful, but you failed to provide service then call razorpay for refund, // TODO : currently the payment will be refund in any case if service not provided, either user is manipulating data, if it is so than that will be handle by razorpay by checking payment id
          issueRefund();
          return;
        }
        console.log(responseData.message);
        return res.status(response.status).json({
          message: responseData.message,
          data: responseData.plandetails,
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
      }
    };
    provideService();
  } catch (error) {
    console.error("Server Error", error);
    //whatever the problem occurred on server, this means you have not provided any service to user, so refund the amount
    issueRefund();
  }
};
module.exports = { createOrder, getKey, verifyPayment };
