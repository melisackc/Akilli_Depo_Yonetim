const db = require("../config/firebase");
const { v4: uuidv4 } = require("uuid");

// ➕ CREATE ORDER + STOCK DECREASE
exports.createOrder = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "Ürün yok" });
    }

    const orderId = uuidv4();

    // 🔥 1. STOK DÜŞ
    for (const item of products) {
      const productRef = db.collection("products").doc(item.id);
      const productDoc = await productRef.get();

      if (!productDoc.exists) {
        return res.status(404).json({ message: "Ürün bulunamadı" });
      }

      const product = productDoc.data();

      const newStock = (product.stock || 0) - item.qty;

      if (newStock < 0) {
        return res.status(400).json({
          message: `${product.name} için yeterli stok yok`
        });
      }

      await productRef.update({ stock: newStock });
    }

    // 🔥 2. ORDER OLUŞTUR
    const order = {
      id: orderId,
      products,
      status: "pending",
      createdAt: new Date(),
      user: req.user?.username || "unknown"
    };

    await db.collection("orders").doc(orderId).set(order);

    res.json({
      message: "Sipariş oluşturuldu + stok düşüldü",
      order
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📦 GET ALL
exports.getOrders = async (req, res) => {
  try {
    const snapshot = await db.collection("orders").get();

    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 GET BY ID
exports.getOrderById = async (req, res) => {
  try {
    const doc = await db.collection("orders").doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Sipariş bulunamadı" });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ UPDATE STATUS (SADELEŞTİRİLDİ)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ["pending", "shipped", "delivered"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Geçersiz durum" });
    }

    // sadece admin değiştirebilir
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "❌ Yetkin yok" });
    }

    await db.collection("orders").doc(req.params.id).update({
      status,
    });

    res.json({ message: "Sipariş durumu güncellendi" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};