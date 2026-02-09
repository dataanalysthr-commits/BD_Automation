const express = require("express");
const router = express.Router();
const controller = require("../controllers/commission-payment-report.controller");
const auth = require("../middleware/auth");

router.get("/report", auth, controller.getCommissionReport);

module.exports = router;
