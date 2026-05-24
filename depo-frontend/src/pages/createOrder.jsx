import { useEffect, useState } from "react";
import API from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateOrder() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    API.get("/products", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setProducts(res.data))
      .catch((err) => toast.error("Ürün listesi alınamadı"));
  }, []);

  const createOrder = async (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      toast.error("Lütfen bir ürün seçin");
      return;
    }

    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    if (quantity > product.stock) {
      toast.warning(`Dikkat: İstenen miktar (${quantity}) mevcut stoktan (${product.stock}) fazla!`);
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const orderData = {
        products: [
          {
            id: product.id,
            name: product.name,
            qty: quantity,
          },
        ],
        totalPrice: 0,
      };

      await API.post("/api/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("✅ Sipariş başarıyla oluşturuldu!");
      setQuantity(1);
      setSelectedProduct("");
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Sipariş oluşturulurken hata meydana geldi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div style={{ marginBottom: '24px' }}>
        <h1>Sipariş Oluştur</h1>
        <p>Müşteriler için manuel sipariş kaydı oluşturun.</p>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        <form onSubmit={createOrder} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Ürün Seç <span style={{color: 'red'}}>*</span></label>
            <select
              className="input-field"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              required
            >
              <option value="">-- Depodaki Ürünler --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Stok: {p.stock})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Adet <span style={{color: 'red'}}>*</span></label>
            <input
              className="input-field"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '10px 0' }} />

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ padding: '12px', fontSize: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Oluşturuluyor...' : '🛒 Siparişi Tamamla'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateOrder;