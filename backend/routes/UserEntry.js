const express = require("express");
const router = express.Router();
const userEntry = require("../controllers/UserEntry.js");
router.route("/user_entry").post(userEntry.userEntry);
module.exports = router;
