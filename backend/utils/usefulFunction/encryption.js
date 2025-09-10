const crypto = require("crypto");
const encrypt = (text) => {
  const algorithm = "aes-256-cbc";
  const key = process.env.encryption_key;
  const iv = process.env.encryption_iv;
  const cipher = crypto.createCipheriv(algorithm,key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted; 
};
module.exports = encrypt;