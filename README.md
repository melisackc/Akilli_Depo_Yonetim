# Bulut Tabanlı Akıllı Depo Yönetim Sistemi 📦✨

E-ticaret firmaları ve lojistik şirketleri için depo yönetimini modernize edip optimize eden, **Yapay Zeka (AI)** destekli ve bulut tabanlı bir depo yönetim sistemidir.

## 🌟 Özellikler

- **Gerçek Zamanlı Stok Takibi:** Firebase altyapısı sayesinde ürünlerin stok durumlarını ve giriş-çıkış işlemlerini anlık olarak izler.
- **Otomatik Sipariş Yönetimi (Auto-Order):** Arka planda çalışan zamanlanmış görevler (cron-jobs), stok seviyeleri kritik eşiğin (minStock) altına düştüğünde otomatik olarak tedarik siparişi oluşturur.
- **Yapay Zeka Envanter Optimizasyonu:** Python tabanlı AI mikro servisi, ürünlerin stok verilerini analiz ederek en ideal minimum stok seviyelerini belirler ve sistemi optimize eder.
- **Çoklu Kullanıcı Desteği (Yetkilendirme):** Güvenli JWT altyapısıyla `Admin` ve `User` rollerini ayırır. Sadece yetkili kullanıcıların stok giriş/çıkış, kargolama ve AI optimizasyonu yapmasına izin verir.
- **Barkod Entegrasyonu:** Ürün aramalarında ve eklemelerde fiziksel barkod okuyucularla tam uyumlu çalışarak işlemleri hızlandırır.
- **Denetim Günlüğü (Audit Ledger):** Sistemdeki tüm tedarik (giriş) ve satış (çıkış) hareketlerini profesyonel bir şekilde kayıt altına alır.

## 🛠️ Kullanılan Teknolojiler

- **Frontend:** React, Vite, CSS (Glassmorphism Tasarım Sistemi), Chart.js
- **Backend (Ana API):** Node.js, Express.js, JWT, Node-Cron
- **AI Mikro Servis:** Python, Flask, Pandas, Scikit-Learn
- **Veritabanı:** Google Firestore (Firebase Admin SDK)

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel ortamınızda tam teşekküllü çalıştırmak için 3 servisin de ayağa kaldırılması gerekmektedir:

### 1. Veritabanı ve Çevre Değişkenleri
- `depo-backend` klasörü içerisine Firebase'den aldığınız `serviceAccountKey.json` dosyasını ekleyin.

### 2. Node.js Backend'i Başlatma
```bash
cd depo-backend
npm install
npm start
# veya geliştirme ortamı için: npm run dev (nodemon)
```
*Backend varsayılan olarak `http://localhost:5000` portunda çalışır.*

### 3. Python AI Servisini Başlatma
```bash
cd ai-service
pip install -r requirements.txt
python app.py
```
*AI mikro servisi varsayılan olarak `http://localhost:5001` portunda çalışır.*

### 4. React Frontend'i Başlatma
```bash
cd depo-frontend
npm install
npm run dev
```
*Frontend varsayılan olarak `http://localhost:5173` portunda çalışır.*

## 🧪 Test Verisi (Seeding)
Veritabanını test etmek ve örnek verilerle (barkodlu gerçekçi ürünler ve hareketler) doldurmak için backend dizinindeyken aşağıdaki komutu kullanabilirsiniz:
```bash
cd depo-backend
node seed.js
```

---
*Bu proje modern modern depo yönetimi isterlerine %100 uyumlu olarak geliştirilmiştir.*
