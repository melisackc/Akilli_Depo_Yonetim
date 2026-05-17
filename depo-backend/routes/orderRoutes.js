const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  createAutoOrders
} = require("../controllers/orderController");

const verifyToken = require("../middleware/authMiddleware");

// 🔥 auto order
const { runAutoOrders } = require("../services/autoOrderService");

router.post("/auto-create", verifyToken, async (req, res) => {
  try {
    await runAutoOrders();
    res.json({ message: "Auto orders checked safely" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➕ create order
router.post("/", verifyToken, createOrder);

// 📦 get all
router.get("/", verifyToken, getOrders);

// 🔍 get one
router.get("/:id", verifyToken, getOrderById);

// ✏️ update
router.put("/:id", verifyToken, updateOrderStatus);

module.exports = router;