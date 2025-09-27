const prisma = require("../shortcut/prisma_initilization");
const getDate = require("../utils/usefulFunction/returnDate");
const userEntry = async (req, res) => {
  const { fingerprint, tempUser, params } = req.body;
  const ip = req.ip;

  const getTrialPlan = await prisma.plans.findUnique({
    where: { name: "Trial" },
  });
  if (!getTrialPlan) {
    console.log("Currently, Trial plan is not available");
    return res
      .status(404)
      .json({ message: "Currently this plan is not available" });
  }

  const paidUser = async () => {
    const cookies = req.cookies;
    if (!cookies && cookies.jwt) {
      console.log("Missing Cookies");
      return res.status(404).json({ message: "Missing Cookies" });
    }
    const jwt = cookies.jwt;
    const ExistingUser = await prisma.users.findUnique({
      where: { reference_token: jwt },
    });
    if (!ExistingUser) {
      console.log("Unknown User");
      return res
        .status(401)
        .json({ message: "You are authorized to use this service" });
    }
    const planExist = await prisma.paidUser.findUnique({
      where: { email: ExistingUser.email },
    });
    if (!planExist) {
      const checkInGuest = await prisma.guestUser.findUnique({
        where: { fingerprint: fingerprint },
      });
      if (!checkInGuest) {
        const createPaidUser = await prisma.paidUser.create({
          data: {
            email: ExistingUser.email,
            plan_id: getTrialPlan.id,
            used: 1,
            max: getTrialPlan.maxConversions,
            maxSize: getTrialPlan.maxFileSizeMB,
            maxBatch: getTrialPlan.batchLimit,
            start_date: getDate(0),
            end_date: getDate(7),
            conversion_allowed: getTrialPlan.formats,
            payment_id: `free-to-${ExistingUser.email}`,
          },
        });
        if (!createPaidUser) {
          console.log("Failed to create Paid User Data");
          return res.status(503).json({
            message:
              "Currently service is unavailable, please try later after sometime",
          });
        }
        console.log("Successfully created paid User data");
        return res.status(200).json({
          message: "Successfully created paid User data",
        });
      }
      if (checkInGuest.used === checkInGuest.max) {
        console.log("Your free trial ended && you don't have any plan yet");
        return res.status(421).json({
          message: "Your free trial ended && you don't have any plan yet",
          lastDBValue: {
            used: checkInGuest.used,
            max: checkInGuest.max,
            maxSize: checkInGuest.maxSize,
          },
        });
      }
      const updateUser = await prisma.paidUser.create({
        data: {
          email: ExistingUser.email,
          plan_id: getTrialPlan.id,
          used: checkInGuest.used + 1,
          max: getTrialPlan.maxConversions,
          maxSize: getTrialPlan.maxFileSizeMB,
          maxBatch: getTrialPlan.batchLimit,
          start_date: getDate(0),
          end_date: getDate(7),
          conversion_allowed: getTrialPlan.formats,
          payment_id: `free-to-${ExistingUser.email}`,
        },
      });
      const alsoUpdateCheckInGuest = await prisma.guestUser.update({
        where: { id: checkInGuest.id },
        data: { used: checkInGuest.used + 1 },
      });
      if (!updateUser || !alsoUpdateCheckInGuest) {
        console.log("Failed to update Paid User Data");
        return res.status(503).json({
          message:
            "Currently service is unavailable, please try later after sometime",
        });
      }
      console.log(
        "Successfully updated paid User data from its guest User data"
      );

      console.log("all checked cleared");
      return res.status(200).json({ message: "all checked cleared" });
    }

    if (tempUser.used === tempUser.max || planExist.used === planExist.max) {
      console.log(
        "Your free trial completed, please choose plan and proceed again"
      );
      return res.status(421).json({
        message:
          "Your free trial completed, please choose plan and proceed again",
        lastDBValue: {
          used: planExist.used,
          max: planExist.max,
          maxSize: planExist.maxSize,
        },
      });
    }
    if (planExist.used !== tempUser.used || planExist.max !== tempUser.max) {
      console.log("This Kind of request is not acceptable, please try again");
      return res.status(406).json({
        message: "This Kind of request is not acceptable, please try again",
        lastDBValue: {
          used: planExist.used,
          max: planExist.max,
          maxSize: planExist.maxSize,
        },
      });
    }
    const updateUser = await prisma.paidUser.update({
      where: { id: planExist.id },
      data: {
        used: planExist.used + 1,
      },
    });
    if (!updateUser) {
      console.log("Failed to update paid User Data");
      return res.status(503).json({
        message:
          "Currently service is unavailable, please try later after sometime",
      });
    }

    //TODO : Make it proper later, currently when user login and if he not used it trial as guest there will be no entry and after using free trial in login and then using trial without login, he can use trial both time, this is not excepted. At other side when user completed its trial without login and then log in then it is not allowed after login, also if he used half trial that record is copied when he is login so no extra trial's and when he login both guest and login uses increases in parallel, due to which there will be no extra trial.
    const alsoGuestUser = await prisma.guestUser.findUnique({
      where: { fingerprint: fingerprint },
    });
    if (!alsoGuestUser) {
      const createGuestUser = await prisma.guestUser.create({
        data: {
          ip: ip,
          used: planExist.used + 1,
          max: getTrialPlan.maxConversions,
          maxSize: getTrialPlan.maxFileSizeMB,
          fingerprint: fingerprint,
          startDate: getDate(),
        },
      });
      if (!createGuestUser) {
        console.log(
          "Currently service is unavailable, please try later after sometime"
        );
        return res.status(503).json({
          message:
            "Currently service is unavailable, please try later after sometime",
        });
      }
      console.log(
        "Successfully created Guest User, simultaneously with paid User"
      );
      return res.status(200).json({
        message:
          "Successfully created Guest User, simultaneously with paid User",
      });
    }
    if (alsoGuestUser.used < alsoGuestUser.max) {
      const updateGuestUser = await prisma.guestUser.update({
        where: { id: alsoGuestUser.id },
        data: {
          ip: ip,
          used: alsoGuestUser.used + 1,
        },
      });
      if (!updateGuestUser) {
        console.log(
          "Currently service is unavailable, please try later after sometime"
        );
        return res.status(503).json({
          message:
            "Currently service is unavailable, please try later after sometime",
        });
      }
      console.log(
        "Successfully updated Guest User along with its current plan subscription"
      );
      return res.status(200).json({
        message:
          "Successfully updated Guest User along with its current plan subscription",
      });
    }

    console.log("Successfully updated Paid User uses");
    return res
      .status(200)
      .json({ message: "Successfully updated Paid User uses" });
  };
  const guestUser = async () => {
    const ExistingUser = await prisma.guestUser.findUnique({
      where: { fingerprint: fingerprint },
    });
    if (!ExistingUser) {
      const createGuestUser = await prisma.guestUser.create({
        data: {
          ip: ip,
          used: 1,
          max: getTrialPlan.maxConversions,
          maxSize: getTrialPlan.maxFileSizeMB,
          fingerprint: fingerprint,
          startDate: getDate(0),
        },
      });
      if (!createGuestUser) {
        console.log("Failed to create Guest User");
        return res.status(503).json({
          message:
            "Currently service is unavailable, please try later after sometime",
        });
      }
      console.log("Successfully created guest User");
      return res
        .status(200)
        .json({ message: "Successfully created guest User" });
    }
    if (
      tempUser.used === tempUser.max ||
      ExistingUser.used === ExistingUser.max
    ) {
      console.log(
        '"Your free trial completed, please choose plan and proceed again'
      );
      return res.status(421).json({
        message:
          "Your free trial completed, please choose plan and proceed again",
        lastDBValue: {
          used: ExistingUser.used,
          max: ExistingUser.max,
          maxSize: ExistingUser.maxSize,
        },
      });
    }
    if (
      ExistingUser.used !== tempUser.used ||
      ExistingUser.max !== tempUser.max
    ) {
      console.log("This Kind of request is not acceptable, please try again");
      return res.status(406).json({
        message: "This Kind of request is not acceptable, please try again",
        lastDBValue: {
          used: ExistingUser.used,
          max: ExistingUser.max,
          maxSize: ExistingUser.maxSize,
        },
      });
    }
    const updateUser = await prisma.guestUser.update({
      where: { id: ExistingUser.id },
      data: {
        ip: ip,
        used: ExistingUser.used + 1,
      },
    });
    if (!updateUser) {
      console.log("Failed to update Guest User Data");
      return res.status(503).json({
        message:
          "Currently service is unavailable, please try later after sometime",
      });
    }
    console.log("Successfully updated data of Guest User");
    return res
      .status(200)
      .json({ message: "Successfully updated data of Guest User" });
  };
  try {
    params.email ? await paidUser() : await guestUser();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
module.exports = { userEntry };
