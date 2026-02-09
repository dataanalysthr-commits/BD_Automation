const express = require("express");
const router = express.Router();
const controller = require("../controllers/paymentReport.controller");
const auth = require("../middleware/auth");

router.get("/total-to-client", auth, controller.getReport);

module.exports = router;
