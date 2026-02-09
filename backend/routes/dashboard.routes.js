const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");
const {
  saveSiteEmployees,
  saveClientCharges
} = require("../controllers/dashboard.controller");

router.post("/site-employees", verifyToken, saveSiteEmployees);
router.post("/client-charges", verifyToken, saveClientCharges);

module.exports = router;
