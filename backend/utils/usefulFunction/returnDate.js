const { formatInTimeZone } = require("date-fns-tz");
const { addDays } = require("date-fns");

const getDate = (daysToAdd = 0) => {
  const now = new Date();
  const futureDate = addDays(now, daysToAdd);
  const timeZone = "Asia/Kolkata";

  return formatInTimeZone(futureDate, timeZone, "dd-MM-yyyy");
};

module.exports = getDate;
