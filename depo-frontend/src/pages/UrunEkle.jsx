import { useState } from "react";
import API from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UrunEkle() {
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [minStock, setMinStock] = useState("");
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !stock || !price) {
      toast.error("Lütfen gerekli alanları doldurun.");
      return;
    }

    try {
      setLoading(true);
      await API.post("/products", {
        name,
        stock: Number(stock),
        minStock: Number(minStock || 0),
        price: Number(price),
        barcode
      });

      toast.success("Ürün başarıyla eklendi! 🎉");

      // clear form
      setName("");
      setStock("");
      setPrice("");
      setMinStock("");
      setBarcode("");
    } catch (err) {
      toast.error("Ürün eklenirken hata oluştu ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <ToastContainer position="top-right" autoClose={3000} />

      <div style={{ marginBottom: '24px' }}>
        <h1>Ürün Ekle</h1>
        <p>Depoya yeni bir ürün kaydı oluşturun.</p>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Ürün Adı <span style={{ color: 'red' }}>*</span></label>
            <input
              className="input-field"
              placeholder="Örn: Kablosuz Klavye"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Stok Miktarı <span style={{ color: 'red' }}>*</span></label>
              <input
                className="input-field"
                placeholder="0"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Minimum Stok</label>
              <input
                className="input-field"
                placeholder="Örn: 10"
                type="number"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Fiyat (₺) <span style={{ color: 'red' }}>*</span></label>
              <input
                className="input-field"
                placeholder="0.00"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Barkod</label>
              <input
                className="input-field"
                placeholder="Okutun veya yazın..."
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
              />
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '10px 0' }} />

          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: '12px', fontSize: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Kaydediliyor...' : '➕ Ürünü Kaydet'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UrunEkle;