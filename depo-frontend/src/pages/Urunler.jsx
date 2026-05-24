import { useEffect, useState } from "react";
import API from "../services/api";
import { isAdmin } from "../utils/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Urunler() {
  const [urunler, setUrunler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const role = localStorage.getItem("role");

  // edit state
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editMinStock, setEditMinStock] = useState("");
  const [editBarcode, setEditBarcode] = useState("");

  // ================= GET PRODUCTS =================
  const fetchProducts = () => {
    const token = localStorage.getItem("token");

    API.get("/products", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setUrunler(res.data))
      .catch((err) => toast.error("Ürünler yüklenirken hata oluştu"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
    
    // Auto-refresh every 15 seconds
    const interval = setInterval(fetchProducts, 15000);
    return () => clearInterval(interval);
  }, []);

  // ================= DELETE =================
  const deleteProduct = async (id) => {
    const token = localStorage.getItem("token");

    if (!isAdmin()) {
      toast.error("❌ Yetkin yok (sadece admin)");
      return;
    }

    if (!window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;

    try {
      await API.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Ürün silindi");
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Hata oluştu");
    }
  };

  // ================= START EDIT =================
  const startEdit = (urun) => {
    if (!isAdmin()) {
      toast.error("❌ Yetkin yok (sadece admin)");
      return;
    }

    setEditId(urun.id);
    setEditName(urun.name || "");
    setEditStock(urun.stock || 0);
    setEditPrice(urun.price || 0);
    setEditMinStock(urun.minStock || 0);
    setEditBarcode(urun.barcode || "");
  };

  // ================= UPDATE =================
  const updateProduct = async () => {
    const token = localStorage.getItem("token");

    try {
      await API.put(
        `/products/${editId}`,
        {
          name: editName,
          stock: Number(editStock),
          minStock: Number(editMinStock),
          price: Number(editPrice),
          barcode: editBarcode
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Ürün başarıyla güncellendi");
      setEditId(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Güncelleme hatası");
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)' }}>
      <h2 className="animate-fade-in">Yükleniyor... ⏳</h2>
    </div>
  );

  const filteredProducts = urunler.filter(u => 
    (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.barcode || "").includes(searchTerm)
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <ToastContainer position="top-right" autoClose={3000} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>Ürünler</h1>
          <p>Depodaki tüm ürünleri yönetin ve stok durumunu takip edin.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', flex: '1', maxWidth: '400px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Barkod okutun veya ürün ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '40px' }}
              autoFocus
            />
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto', padding: '1px' }}>
        {urunler.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Depoda hiç ürün bulunmuyor.
          </div>
        ) : (
          <table className="modern-table">
            <thead>
              <tr>
                <th>Barkod</th>
                <th>Ürün Adı</th>
                <th>Stok</th>
                {isAdmin() && <th>Min Stok</th>}
                <th>Fiyat</th>
                {isAdmin() && <th>İşlemler</th>}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((u) => (
                <tr key={u.id}>
                  {/* BARCODE */}
                  <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {editId === u.id ? (
                      <input className="input-field" value={editBarcode} onChange={(e) => setEditBarcode(e.target.value)} placeholder="Barkod" />
                    ) : (
                      u.barcode || "-"
                    )}
                  </td>
                  
                  {/* NAME */}
                  <td>
                    {editId === u.id ? (
                      <input className="input-field" value={editName} onChange={(e) => setEditName(e.target.value)} />
                    ) : (
                      <div style={{ fontWeight: '500' }}>{u.name}</div>
                    )}
                  </td>

                  {/* STOCK */}
                  <td>
                    {editId === u.id ? (
                      <input className="input-field" type="number" value={editStock} onChange={(e) => setEditStock(e.target.value)} style={{ width: '80px' }} />
                    ) : (
                      <span className={`badge ${u.stock <= (u.minStock || 0) ? 'badge-danger' : 'badge-success'}`}>
                        {u.stock}
                      </span>
                    )}
                  </td>

                  {/* MIN STOCK */}
                  {isAdmin() && (
                    <td>
                      {editId === u.id ? (
                        <input className="input-field" type="number" value={editMinStock} onChange={(e) => setEditMinStock(e.target.value)} style={{ width: '80px' }} />
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>{u.minStock || 0}</span>
                      )}
                    </td>
                  )}

                  {/* PRICE */}
                  <td>
                    {editId === u.id ? (
                      <input className="input-field" type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} style={{ width: '100px' }} />
                    ) : (
                      <span style={{ fontWeight: '600' }}>₺{u.price}</span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  {isAdmin() && (
                    <td>
                      {editId === u.id ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={updateProduct}>Kaydet</button>
                          <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => setEditId(null)}>İptal</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => startEdit(u)}>✏️ Düzenle</button>
                          <button className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => deleteProduct(u.id)}>🗑️</button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                 <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>Sonuç bulunamadı</td>
                 </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Urunler;