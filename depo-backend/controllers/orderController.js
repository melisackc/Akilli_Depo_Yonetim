const db = require("../config/firebase");
const { v4: uuidv4 } = require("uuid");

/* ================= CREATE ORDER ================= */
exports.createOrder = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "Ürün yok" });
    }

    const orderId = uuidv4();

    // 🔥 stok düş
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
          message: `${product.name} için yeterli stok yok`,
        });
      }

      await productRef.update({ stock: newStock });

      // 🔥 Stok Çıkış (OUT) hareketini Firebase'e profesyonelce kaydet
      await db.collection("stockMovements").add({
        productId: item.id,
        productName: product.name,
        type: "OUT",
        quantity: item.qty,
        date: new Date(),
        user: req.user?.username || "unknown",
        reason: "Sipariş Çıkışı"
      });
    }

    const order = {
      id: orderId,
      products,
      status: "pending",
      createdAt: new Date(),
      user: req.user?.username || "unknown",
    };

    await db.collection("orders").doc(orderId).set(order);

    res.json({
      message: "Sipariş oluşturuldu",
      order,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= GET ALL ================= */
exports.getOrders = async (req, res) => {
  try {
    const snapshot = await db.collection("orders").get();

    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(orders);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= GET BY ID ================= */
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

/* ================= UPDATE STATUS ================= */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ["pending", "shipped", "delivered"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Geçersiz durum" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Yetkin yok" });
    }

    await db.collection("orders").doc(req.params.id).update({
      status
    });

    res.json({ message: "Sipariş güncellendi" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= AUTO ORDER ================= */
exports.createAutoOrders = async (req, res) => {
  const lockRef = db.collection("system").doc("autoOrderLock");

  try {
    const lockDoc = await lockRef.get();

    // 🔥 LOCK CHECK
    if (lockDoc.exists && lockDoc.data().running) {
      return res.json({ message: "Auto order already running" });
    }

    await lockRef.set({ running: true });

    const snapshot = await db.collection("products").get();

    const ordersToCreate = [];

    for (const doc of snapshot.docs) {
      const p = doc.data();

      if ((p.stock || 0) <= (p.minStock || 0)) {

        const existing = await db
          .collection("orders")
          .where("status", "==", "auto-created")
          .get();

        let alreadyExists = false;

        existing.forEach(orderDoc => {
          const order = orderDoc.data();

          const found = order.products?.some(
            item => String(item.productId) === String(doc.id)
          );

          if (found) {
            alreadyExists = true;
          }
        });

        if (alreadyExists) continue;

        const qtyNeeded =
          (p.minStock || 0) - (p.stock || 0);

        if (qtyNeeded <= 0) continue;

        ordersToCreate.push({
          productId: doc.id,
          productName: p.name,
          qty: qtyNeeded,
        });
      }
    }

    if (ordersToCreate.length === 0) {
      await lockRef.set({ running: false });

      return res.json({
        message: "Yeni auto order gerekmiyor",
        count: 0,
      });
    }

    const orderId = uuidv4();

    const order = {
      id: orderId,
      products: ordersToCreate,
      status: "auto-created",
      createdAt: new Date(),
      user: req.user?.username || "system",
    };

    await db.collection("orders").doc(orderId).set(order);

    await lockRef.set({ running: false });

    res.json({
      message: "Auto order oluşturuldu",
      count: 1,
      order,
    });

  } catch (err) {
    // 🔥 HATA OLURSA LOCK AÇ
    await lockRef.set({ running: false });

    res.status(500).json({
      error: err.message
    });
  }
};