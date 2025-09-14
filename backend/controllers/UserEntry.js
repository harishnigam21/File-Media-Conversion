const prisma = require("../shortcut/prisma_initilization");
const userEntry = async (req, res) => {
  const { fingerprint, tempUser, params } = req.body;
  const ip = req.ip;
  const paidUser = async () => {
    const cookies = req.cookies;
    if (!cookies && cookies.jwt) {
      return res.status(404).json({ message: "Missing Cookies" });
    }
    const jwt = cookies.jwt;
    const ExistingUser = await prisma.users.findUnique({
      where: { reference_token: jwt },
    });
    if (!ExistingUser) {
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
        const updateUser = await prisma.paidUser.create({
          data: {
            email: ExistingUser.email,
            plan: "trial",
            session: JSON.stringify({ ...tempUser, used: tempUser + 1 }),
          },
        });
        if (!updateUser) {
          console.log("Failed to update Paid User Data");
          return res.status(503).json({
            message:
              "Currently service is unavailable, please try later after sometime",
          });
        }
        console.log("Successfully updated paid User data");
        return res.status(200).json({
          message: "Successfully updated paid User data",
        });
      }
      const checkInGuestSession = JSON.parse(checkInGuest.session);
      const updateUser = await prisma.paidUser.create({
        data: {
          email: ExistingUser.email,
          plan: "trial",
          session: checkInGuest.session,
        },
      });
      if (!updateUser) {
        console.log("Failed to update Paid User Data");
        return res.status(503).json({
          message:
            "Currently service is unavailable, please try later after sometime",
        });
      }
      console.log(
        "Successfully updated paid User data from its guest User data"
      );
      if (checkInGuestSession.used === checkInGuestSession.max) {
        console.log("Your free trial ended && you don't have any plan yet");
        return res.status(402).json({
          message: "Your free trial ended && you don't have any plan yet",
        });
      }
      console.log("all checked cleared");
      return res.status(200).json({ message: "all checked cleared" });
    }

    const ExistingUserSession = JSON.parse(planExist.session);
    if (
      tempUser.used === tempUser.max ||
      ExistingUserSession.used === ExistingUserSession.max ||
      ExistingUserSession !== tempUser
    ) {
      return res.status(402).json({
        message:
          "Your free trial completed, please choose plan and proceed again",
      });
    }

    const updateUser = await prisma.paidUser.update({
      where: { id: planExist.id },
      data: {
        session: JSON.stringify({
          ...ExistingUserSession,
          used: ExistingUserSession.used + 1,
        }),
      },
    });
    if (!updateUser) {
      console.log("Failed to update Guest User Data");
      return res.status(503).json({
        message:
          "Currently service is unavailable, please try later after sometime",
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
          session: JSON.stringify({ ...tempUser, used: tempUser.used + 1 }),
          fingerprint: fingerprint,
        },
      });
      if (!createGuestUser) {
        console.log("Failed to catch Guest User Data");
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
    const ExistingUserSession = JSON.parse(ExistingUser.session);
    if (
      tempUser.used === tempUser.max ||
      ExistingUserSession.used === ExistingUserSession.max ||
      ExistingUserSession !== tempUser
    ) {
      return res.status(402).json({
        message:
          "Your free trial completed, please choose plan and proceed again",
      });
    }
    const updateUser = await prisma.guestUser.update({
      where: { id: ExistingUser.id },
      data: {
        ip: ip,
        session: JSON.stringify({
          ...ExistingUserSession,
          used: ExistingUserSession.used + 1,
        }),
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
