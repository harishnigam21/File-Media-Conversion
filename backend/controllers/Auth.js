const prisma = require("../shortcut/prisma_initilization");
const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(404).json({ message: "Important fields are missing " });
    }
    const validUser = await prisma.users.findUnique({
      where: { email: email },
    });
    if (!validUser) {
      console.log("Unknown user trying to access");
      return res.status(403).json({
        message: `You are not yet member of ${process.env.SITE_NAME}`,
        redirect: "/signup",
      });
    }
    if (validUser.password !== password) {
      console.log("Incorrect Password");
      return res.status(401).json({ message: "Incorrect Password" });
    }
    
    console.log("Successfully Logged In");
    return res.status(200).json({ message: "Successfully Logged In" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const signUp = async (req, res) => {};

const signOut = async (req, res) => {};

module.exports = { signIn, signUp, signOut };
