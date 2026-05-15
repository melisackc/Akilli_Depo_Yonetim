import { useEffect, useState } from "react";
import API from "../services/api";

function Urunler() {
  const [urunler, setUrunler] = useState([]);
  const [loading, setLoading] = useState(true);

  // düzenleme state
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editPrice, setEditPrice] = useState("");

  // ÜRÜNLERİ ÇEK
  const fetchProducts = () => {
    API.get("/products")
      .then((res) => {
        setUrunler(res.data);
      })
      .catch((err) => {
        console.log("Hata:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ÜRÜN SİL
  const deleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`);

      alert("Ürün silindi");

      fetchProducts();

    } catch (err) {
      console.log(err);
    }
  };

  // DÜZENLEME MODU
  const startEdit = (urun) => {
    setEditId(urun.id);
    setEditName(urun.name);
    setEditStock(urun.stock);
    setEditPrice(urun.price);
  };

  // GÜNCELLE
  const updateProduct = async () => {
    try {
      await API.put(`/products/${editId}`, {
        name: editName,
        stock: Number(editStock),
        price: Number(editPrice)
      });

      alert("Ürün güncellendi");

      setEditId(null);

      fetchProducts();

    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return <h3>Yükleniyor...</h3>;
  }

  return (
    <div>
      <h2>📦 Ürünler</h2>

      {urunler.length === 0 ? (
        <p>Hiç ürün yok</p>
      ) : (
        <table border="1" cellPadding="10">
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

                <td>
                  {editId === u.id ? (
                    <>
                      <button onClick={updateProduct}>
                        Kaydet
                      </button>

                      <button onClick={() => setEditId(null)}>
                        İptal
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(u)}>
                        Düzenle
                      </button>

                      <button onClick={() => deleteProduct(u.id)}>
                        Sil
                      </button>
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