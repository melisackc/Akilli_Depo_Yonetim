const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const db = require("./config/firebase");

const app = express();

app.use(cors());
app.use(express.json());

const SECRET_KEY = "supersecretkey123";

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend çalışıyor 🚀");
});

// TEST USER
const user = {
  username: "admin",
  password: "123456"
};

/* ================= JWT MIDDLEWARE ================= */
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({ message: "Token yok" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Geçersiz token" });
    }

    req.user = decoded;
    next();
  });
}

/* ================= LOGIN ================= */
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username !== user.username || password !== user.password) {
    return res.status(401).json({ message: "Hatalı giriş" });
  }

  const token = jwt.sign(
    { username },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.json({
  message: "Giriş başarılı",
  token,
  username
});
});

/* ================= PRODUCTS ================= */

// CREATE
app.post("/products", verifyToken, async (req, res) => {
  try {
    const product = req.body;

    const docRef = await db.collection("products").add(product);

    res.json({
      message: "Ürün eklendi",
      id: docRef.id
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ALL
app.get("/products", verifyToken, async (req, res) => {
  try {
    const snapshot = await db.collection("products").get();

    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(products);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE
app.delete("/products/:id", verifyToken, async (req, res) => {
  try {
    await db.collection("products").doc(req.params.id).delete();
    res.json({ message: "Ürün silindi" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE
app.put("/products/:id", verifyToken, async (req, res) => {
  try {
    await db.collection("products").doc(req.params.id).update(req.body);
    res.json({ message: "Ürün güncellendi" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ================= STOCK ================= */
app.post("/stock", verifyToken, async (req, res) => {
  try {
    const { productId, type, quantity } = req.body;

    const productRef = db.collection("products").doc(productId);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    const product = productDoc.data();

    let newStock = product.stock;

    if (type === "IN") {
      newStock += quantity;
    } else if (type === "OUT") {
      newStock -= quantity;

      if (newStock < 0) {
        return res.status(400).json({ message: "Stok yetersiz" });
      }
    }

    await productRef.update({ stock: newStock });

    await db.collection("stockMovements").add({
      productId,
      type,
      quantity,
      date: new Date(),
      user: req.user.username
    });

    res.json({
      message: "Stok güncellendi",
      newStock
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ================= REPORTS ================= */

// LOW STOCK
app.get("/reports/low-stock", verifyToken, async (req, res) => {
  try {
    const snapshot = await db.collection("products").get();

    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const lowStock = products.filter(p => p.stock <= 5);

    res.json(lowStock);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// MOVEMENTS
app.get("/reports/movements", verifyToken, async (req, res) => {
  try {
    const snapshot = await db.collection("stockMovements").get();

    const movements = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(movements);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SUMMARY
app.get("/reports/summary", verifyToken, async (req, res) => {
  try {
    const snapshot = await db.collection("products").get();

    const totalProducts = snapshot.size;

    const products = snapshot.docs.map(doc => doc.data());
    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);

    res.json({
      totalProducts,
      totalStock
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ================= SERVER ================= */
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});