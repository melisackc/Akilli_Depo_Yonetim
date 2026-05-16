const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

const verifyToken = require("../middleware/authMiddleware");

// ➕ Sipariş oluştur
router.post("/", verifyToken, createOrder);

// 📦 Tüm siparişleri getir
router.get("/", verifyToken, getOrders);

// 🔍 Tek sipariş getir
router.get("/:id", verifyToken, getOrderById);

// ✏️ Durum güncelle
router.put("/:id", verifyToken, updateOrderStatus);

// ❌ Sipariş sil (opsiyonel ama faydalı)
router.delete("/:id", verifyToken, deleteOrder);

module.exports = router;