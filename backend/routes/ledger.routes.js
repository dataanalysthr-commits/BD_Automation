const express = require("express");
const router = express.Router();
const controller = require("../controllers/ledger.controller");
const auth = require("../middleware/auth");

router.get("/", auth, controller.getLedger);

module.exports = router;
