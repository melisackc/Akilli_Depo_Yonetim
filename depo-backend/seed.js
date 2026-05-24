const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const sampleProducts = [
  { name: "Kablosuz Mouse", stock: 45, minStock: 20, price: 350.00, barcode: "869123456001" },
  { name: "Mekanik Klavye", stock: 12, minStock: 15, price: 1200.00, barcode: "869123456002" },
  { name: "27 inç Monitör", stock: 8, minStock: 10, price: 4500.00, barcode: "869123456003" },
  { name: "Bluetooth Kulaklık", stock: 50, minStock: 25, price: 800.00, barcode: "869123456004" },
  { name: "USB-C Hub", stock: 100, minStock: 30, price: 250.00, barcode: "869123456005" },
  { name: "Ergonomik Ofis Koltuğu", stock: 4, minStock: 5, price: 3200.00, barcode: "869123456006" },
  { name: "Oyuncu Mousepad", stock: 80, minStock: 40, price: 150.00, barcode: "869123456007" },
  { name: "Harici SSD 1TB", stock: 15, minStock: 20, price: 2100.00, barcode: "869123456008" },
  { name: "HDMI Kablo 2m", stock: 200, minStock: 50, price: 80.00, barcode: "869123456009" },
  { name: "Webcam 1080p", stock: 22, minStock: 15, price: 950.00, barcode: "869123456010" }
];

async function deleteCollection(collectionPath) {
  const snapshot = await db.collection(collectionPath).get();
  if (snapshot.size === 0) return;

  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
  console.log(`${collectionPath} koleksiyonu temizlendi.`);
}

async function seedDatabase() {
  try {
    console.log("Eski veriler temizleniyor...");
    await deleteCollection("products");
    await deleteCollection("orders");
    await deleteCollection("stockMovements");

    console.log("Yeni gerçekçi örnek ürünler ekleniyor...");
    const addedProducts = [];
    for (const product of sampleProducts) {
      const docRef = await db.collection("products").add(product);
      addedProducts.push({ id: docRef.id, ...product });
    }

    console.log("Örnek stok hareketleri (son hareketler) ekleniyor...");
    const movements = [];
    const now = new Date();
    
    // Add fake IN/OUT movements for the first 3 products to make the dashboard look alive
    if (addedProducts.length >= 3) {
      movements.push({
        productId: addedProducts[0].id,
        productName: addedProducts[0].name,
        type: "IN",
        quantity: 20,
        date: new Date(now.getTime() - 1000 * 60 * 60 * 2), // 2 hours ago
        user: "admin"
      });
      movements.push({
        productId: addedProducts[1].id,
        productName: addedProducts[1].name,
        type: "OUT",
        quantity: 3,
        date: new Date(now.getTime() - 1000 * 60 * 30), // 30 mins ago
        user: "user"
      });
      movements.push({
        productId: addedProducts[2].id,
        productName: addedProducts[2].name,
        type: "IN",
        quantity: 15,
        date: new Date(now.getTime() - 1000 * 60 * 5), // 5 mins ago
        user: "admin"
      });
    }

    const movementPromises = movements.map(m => {
      return db.collection("stockMovements").add(m);
    });
    
    await Promise.all(movementPromises);

    console.log("✅ Tüm ürünler ve örnek hareketler başarıyla eklendi!");
    process.exit(0);
  } catch (error) {
    console.error("Hata oluştu:", error);
    process.exit(1);
  }
}

seedDatabase();
