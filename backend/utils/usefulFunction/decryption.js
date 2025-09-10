const crypto = require("crypto");
const decrypt = (text) => {
  const algorithm = "aes-256-cbc";
  const key = process.env.encryption_key;
  const iv = process.env.encryption_iv;
  const decipher = crypto.createDecipheriv(algorithm,key,iv);
  let decrypted = decipher.update(text, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted; 
};
module.exports = decrypt;