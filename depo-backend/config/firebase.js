const admin = require("firebase-admin");

// service account key dosyan
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Firestore database
const db = admin.firestore();

console.log("🔥 Firebase bağlandı");

module.exports = db;