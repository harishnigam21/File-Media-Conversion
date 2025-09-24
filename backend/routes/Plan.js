const express = require("express");
const router = express.Router();
const Plan = require("../controllers/Plan.js");
router.post("/buy_plan", Plan.BuyPlan).get("/get_plan", Plan.GetPlan);
router.post("/get_unique_plan", Plan.GetUniquePlan);
module.exports = router;
