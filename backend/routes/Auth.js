const express = require("express");
const router = express.Router();
const Auth = require("../controllers/Auth");
router.route("/signin").post(Auth.signIn);
router.route("/signup").post(Auth.signUp);
router.route("/signout").post(Auth.signOut);

module.exports = router;