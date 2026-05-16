const db = require("../config/firebase");

/**
 * STOK HAREKETİ (GİRİŞ / ÇIKIŞ)
 */
exports.moveStock = async (req, res) => {
  try {
    const { productId, quantity, type } = req.body;
    const user = req.user?.username || "system";

    if (!productId || !quantity || !type) {
      return res.status(400).json({ message: "Eksik veri" });
    }

    const productRef = db.collection("products").doc(productId);
    const productSnap = await productRef.get();

    if (!productSnap.exists) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    const productData = productSnap.data();
    let newStock = productData.stock;

    // STOK HESABI
    if (type === "IN") {
      newStock += quantity;
    } else if (type === "OUT") {
      if (productData.stock < quantity) {
        return res.status(400).json({ message: "Yetersiz stok" });
      }
      newStock -= quantity;
    } else {
      return res.status(400).json({ message: "Geçersiz tip" });
    }

    // ÜRÜNÜ GÜNCELLE
    await productRef.update({ stock: newStock });

    // HAREKET KAYDI
    await db.collection("stockMovements").add({
      productId,
      quantity,
      type,
      user,
      date: new Date().toISOString()
    });

    return res.json({
      message: "Stok güncellendi",
      newStock
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Sunucu hatası" });
  }
};