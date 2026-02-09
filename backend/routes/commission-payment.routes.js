const express = require("express");
const router = express.Router();
const controller = require("../controllers/commission-payment.controller");
const auth = require("../middleware/auth");

router.post("/save", auth, controller.saveCommissionPayment);

module.exports = router;
