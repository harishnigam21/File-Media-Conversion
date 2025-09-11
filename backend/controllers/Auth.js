const prisma = require("../shortcut/prisma_initilization");
const bcrypt = require("bcrypt");
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
      console.log(`Unknown user:${email} trying to access`);
      return res.status(403).json({
        message: `You are not yet member of ${process.env.SITE_NAME}`,
        redirect: "/signup",
      });
    }
    const checkPassword = bcrypt.compare(validUser.password, password);
    if (!checkPassword) {
      console.log(`${email} Incorrect Password`);
      return res.status(401).json({ message: "Incorrect Password" });
    }

    console.log("Successfully Logged In");
    return res.status(200).json({ message: "Successfully Logged In" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const signUp = async (req, res) => {
  const {
    first_name,
    middle_name,
    last_name,
    gender,
    mobile_no,
    email,
    password,
  } = req.body;
  try {
    if (
      !first_name ||
      !last_name ||
      !gender ||
      !mobile_no ||
      !email ||
      !password
    ) {
      return res.status(404).json({ message: "Important fields are missing" });
    }
    const userExist = await prisma.users.findUnique({
      where: { email: email },
    });
    if (userExist) {
      console.log(
        `You are already member of ${process.env.SITE_NAME}, redirecting you to the signin page`
      );
      return res.status(409).json({
        message: `You are already member of ${process.env.SITE_NAME}, redirecting you to the signin page`,
      });
    }
    const initialRefToken = `new member : ${email}`;
    const encrypted_password = await bcrypt.hash(password, 5);
    const newMember = {
      first_name: first_name,
      middle_name: middle_name,
      last_name: last_name,
      gender: gender,
      mobile_no: mobile_no,
      email: email,
      password: encrypted_password,
      reference_token: initialRefToken,
    };
    try {
      const createUser = await prisma.users.create({
        data: newMember,
      });
      if (!createUser) {
        console.log("Unable to create new User");
        return res.status(400).json({ message: "Unable to create new User" });
      }
      return res.status(200).json({
        message: `You have been successfully added as a member of ${process.env.SITE_NAME} `,
      });
    } catch (error) {
      console.log(error);
      return res.status(502).json({ message: error.message });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const signOut = async (req, res) => {};

module.exports = { signIn, signUp, signOut };
