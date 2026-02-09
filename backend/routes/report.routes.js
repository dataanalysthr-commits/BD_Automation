const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");
const auth = require("../middleware/auth");


router.get("/financial-summary",
     auth,
      reportController.getFinancialSummary);

module.exports = router;
