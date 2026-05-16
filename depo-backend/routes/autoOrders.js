const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");

const verifyToken = require("../middleware/authMiddleware");

// Sipariş oluştur
router.post("/", verifyToken, createOrder);

// Tüm siparişleri getir
router.get("/", verifyToken, getOrders);

// Tek sipariş getir
router.get("/:id", verifyToken, getOrderById);

// Sipariş durumu güncelle (pending, shipped, delivered)
router.put("/:id", verifyToken, updateOrderStatus);

module.exports = router;