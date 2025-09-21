const express = require("express");
const router = express.Router();
const Plan = require("../controllers/Plan.js");
router.post("/buy_plan", Plan.BuyPlan).get("/get_plan", Plan.GetPlan);
module.exports = router;
