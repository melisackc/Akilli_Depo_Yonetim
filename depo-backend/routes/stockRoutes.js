const express = require("express");
const router = express.Router();
const { moveStock } = require("../controllers/stockController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/move", verifyToken, moveStock);

module.exports = router;