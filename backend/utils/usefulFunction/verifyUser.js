const prisma = require("../../shortcut/prisma_initilization");
const decrypt = require("./decryption");
const verifyUser = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies) {
    return res.status(401).json({ Message: "You are not authorized" });
  }
  const encryptedEmail = cookies.emenc;
  if (!encryptedEmail) {
    return res.status(403).json({
      Message:
        "Important cookie is missing, such type of access is not allowed",
    });
  }
  const decryptEmail = decrypt(encryptedEmail);
  if (!decryptEmail) {
    return res.status(503).json({ Message: "Problem at Decryption function" });
  }
  const validUser = await prisma.users.findUnique({
    where: { email: decryptEmail },
  });
  if (!validUser) {
    return res.status(401).json({ Message: "You are not currently signed Up" });
  }
  return decryptEmail;
};
module.exports = verifyUser;
