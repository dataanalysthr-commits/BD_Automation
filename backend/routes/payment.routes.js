const express = require("express");
const router = express.Router();
const paymentCtrl = require("../controllers/payment.controller");
const auth = require("../middleware/auth");

router.post("/save", auth, paymentCtrl.savePayment);

module.exports = router;
