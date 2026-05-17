const db = require("../config/firebase");
const { v4: uuidv4 } = require("uuid");

async function runAutoOrders() {
  const snapshot = await db.collection("products").get();

  const products = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  const lowStockItems = products.filter(
    p => (p.stock || 0) <= (p.minStock || 0)
  );

  for (const p of lowStockItems) {

    // 🔥 KRİTİK: duplicate engelle
    const existing = await db.collection("orders")
      .where("productId", "==", p.id)
      .where("status", "==", "auto-created")
      .get();

    if (!existing.empty) continue;

    const order = {
      id: uuidv4(),
      productId: p.id,
      products: [
        {
          id: p.id,
          name: p.name,
          qty: (p.minStock || 0) - (p.stock || 0)
        }
      ],
      status: "auto-created",
      createdAt: new Date(),
      user: "system"
    };

    await db.collection("orders").doc(order.id).set(order);
  }

  return { success: true };
}

module.exports = { runAutoOrders };