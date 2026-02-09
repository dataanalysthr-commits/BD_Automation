
const express = require("express");
const router = express.Router();
const { addHoEmployees } = require("../controllers/ho.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.post("/add", verifyToken, addHoEmployees);

module.exports = router;
