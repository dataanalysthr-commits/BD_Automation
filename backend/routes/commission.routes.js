
const express = require("express");
const router = express.Router();
const { addClientCommission } = require("../controllers/commission.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.post("/add", verifyToken, addClientCommission);

module.exports = router;
