const prisma = require("../shortcut/prisma_initilization");
const getDate = require("../utils/usefulFunction/returnDate");
const GetPlan = async (req, res) => {
  const plans = await prisma.plans.findMany();
  if (!plans) {
    console.log("Currently, we don't have any plan yet");
    return res
      .status(404)
      .json({ message: "Currently, we don't have any plan yet" });
  }

  console.log("Successfully got all plans");
  return res
    .status(200)
    .json({ message: "Successfully got all plans", plans: plans });
};
const BuyPlan = async (req, res) => {
  const { id, name, payment } = req.body; //payment should be an object that contain status, payment id, and other details

  const paymentSuccess = async () => {
    try {
      const cookies = req.cookies;
      if (!cookies || cookies.jwt) {
        return res.status(404).json({ message: "Missing Important Cookie's" });
      }
      const ExistingUser = await prisma.users.findUnique({
        where: { reference_token: cookies.jwt },
      });
      if (!ExistingUser) {
        console.log("Unknown User");
        return res.status(401).json({ message: "You are not authorized User" });
      }
      const PlanExist = await prisma.paidUser.findUnique({
        where: { email: ExistingUser.email },
      });
      if (!PlanExist) {
        const planAvailability = await prisma.plans.findUnique({
          where: { id: id, name: name },
        });
        if (!planAvailability) {
          return res
            .status(404)
            .json({ message: "Sorry, Currently this plan is not available" });
        }
        const createNewPaidUser = await prisma.paidUser.create({
          data: {
            email: ExistingUser.email,
            plan_id: planAvailability.id,
            used: 0,
            max: planAvailability.maxConversions,
            maxSize: planAvailability.maxFileSizeMB,
            maxBatch: planAvailability.batchLimit,
            start_date: getDate(0),
            end_date: getDate(
              planAvailability.name.toLowerCase().includes("mon")
                ? 30
                : planAvailability.name.toLowerCase().includes("year")
                ? 365
                : planAvailability.name.toLowerCase().includes("unlimited")
                ? 10 * 365
                : 0
            ),
          },
        });
        if (!createNewPaidUser) {
          console.log("Failed to create New Paid User");
          return res.status(503).json({
            message:
              "Currently service is unavailable, please try later after sometime",
          });
        }
        return res.status(200).json({
          message: "Successfully Purchased plan",
          plandetails: {
            used: 0,
            max: planAvailability.maxConversions,
            size: planAvailability.maxFileSizeMB,
            formatAllowed: planAvailability.formats,
          },
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message:
          "Due to server error, your purchase has been failed. Your refund will be initiated within 48hr",
      });
    }
  };
  const paymentFailed = async () => {
    console.log("Your payment is failed, please try again later");
    return res
      .status(417)
      .json({ message: "Your payment is failed, please try again later" });
  };
  try {
    payment.status ? paymentSuccess : paymentFailed;
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};
module.exports = { BuyPlan, GetPlan };
