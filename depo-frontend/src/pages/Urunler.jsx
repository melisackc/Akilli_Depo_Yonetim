import { useEffect, useState } from "react";
import API from "../services/api";
import { isAdmin } from "../utils/auth";

function Urunler() {
  const [urunler, setUrunler] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem("role");

  // edit state
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editPrice, setEditPrice] = useState("");

  // ================= GET PRODUCTS =================
  const fetchProducts = () => {
    const token = localStorage.getItem("token");

    API.get("/products", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setUrunler(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= DELETE =================
  const deleteProduct = async (id) => {
    const token = localStorage.getItem("token");

    if (!isAdmin()) {
      alert("❌ Yetkin yok (sadece admin)");
      return;
    }

    try {
      await API.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Ürün silindi");
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "❌ Hata oluştu");
    }
  };

  // ================= START EDIT =================
  const startEdit = (urun) => {
    if (!isAdmin()) {
      alert("❌ Yetkin yok (sadece admin)");
      return;
    }

    setEditId(urun.id);
    setEditName(urun.name);
    setEditStock(urun.stock);
    setEditPrice(urun.price);
  };

  // ================= UPDATE =================
  const updateProduct = async () => {
    const token = localStorage.getItem("token");

    if (!isAdmin()) {
      alert("❌ Yetkin yok (sadece admin)");
      return;
    }

    try {
      await API.put(
        `/products/${editId}`,
        {
          name: editName,
          stock: Number(editStock),
          price: Number(editPrice),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Ürün güncellendi");

      setEditId(null);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "❌ Güncelleme hatası");
    }
  };

  if (loading) return <h3>Yükleniyor...</h3>;

  return (
    <div style={{ padding: 20 }}>
      <h2>📦 Ürünler</h2>

      {urunler.length === 0 ? (
        <p>Hiç ürün yok</p>
      ) : (
        <table border="1" cellPadding="10" width="100%">
          <thead>
            <tr>
              <th>Ürün Adı</th>
              <th>Stok</th>
              <th>Fiyat</th>
              <th>İşlemler</th>
            </tr>
          </thead>

          <tbody>
            {urunler.map((u) => (
              <tr key={u.id}>
                {/* NAME */}
                <td>
                  {editId === u.id ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    u.name
                  )}
                </td>

                {/* STOCK */}
                <td>
                  {editId === u.id ? (
                    <input
                      value={editStock}
                      onChange={(e) => setEditStock(e.target.value)}
                    />
                  ) : (
                    u.stock
                  )}
                </td>

                {/* PRICE */}
                <td>
                  {editId === u.id ? (
                    <input
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                    />
                  ) : (
                    u.price
                  )}
                </td>

                {/* ACTIONS */}
                <td>
                  {editId === u.id ? (
                    <>
                      <button onClick={updateProduct}>Kaydet</button>
                      <button onClick={() => setEditId(null)}>İptal</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(u)}>Düzenle</button>
                      <button onClick={() => deleteProduct(u.id)}>Sil</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Urunler;