const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
} = require("../controllers/orderController");

const verifyToken = require("../middleware/authMiddleware");

// ➕ Sipariş oluştur
router.post("/", verifyToken, createOrder);

// 📦 Liste
router.get("/", verifyToken, getOrders);

// 🔍 Tek sipariş
router.get("/:id", verifyToken, getOrderById);

// ✏️ status update
router.put("/:id", verifyToken, updateOrderStatus);

module.exports = router;