const express = require("express");
const router = express.Router();
const controller = require("../controllers/commission-ledger.controller");
const auth = require("../middleware/auth");

router.get("/", auth, controller.getCommissionLedger);

module.exports = router;
