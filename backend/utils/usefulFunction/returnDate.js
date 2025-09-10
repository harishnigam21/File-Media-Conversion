const { formatInTimeZone } = require("date-fns-tz");
const getDate = () => {
  const now = new Date();
  const timeZone = "Asia/Kolkata";
  const dateFormat = formatInTimeZone(now, timeZone, "dd-MM-yyyy HH:mm:ss");
  return dateFormat;
};
module.exports = getDate;
