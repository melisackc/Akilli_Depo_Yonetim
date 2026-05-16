import { useEffect, useState } from "react";
import API from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem("role"); // 🔥 EKLENDİ

  const fetchOrders = () => {
    const token = localStorage.getItem("token");

    API.get("/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <h3>Yükleniyor...</h3>;

  // 🔥 STATUS UPDATE FONKSİYONU
  const updateStatus = (id, status) => {
    const token = localStorage.getItem("token");

    API.put(
      `/api/orders/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(() => {
        alert("Durum güncellendi");
        fetchOrders();
      })
      .catch((err) => {
        const msg = err.response?.data?.message || "Hata";
        alert(msg);
      });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📦 Siparişler</h2>

      {orders.length === 0 ? (
        <p>Henüz sipariş yok</p>
      ) : (
        <table border="1" cellPadding="10" width="100%">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ürünler</th>
              <th>Durum</th>
              <th>Kullanıcı</th>
              <th>Tarih</th>
              <th>İşlem</th> {/* 🔥 EKLENDİ */}
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>

                <td>
                  {o.products?.map((p, i) => (
                    <div key={i}>
                      {p.name} - {p.qty} adet
                    </div>
                  ))}
                </td>

                <td>
                  <b>{o.status}</b>
                </td>

                <td>{o.user}</td>

                <td>
                  {o.createdAt
                    ? new Date(
                        o.createdAt.seconds
                          ? o.createdAt.seconds * 1000
                          : o.createdAt
                      ).toLocaleString()
                    : "-"}
                </td>

                {/* 🔥 ADMIN BUTONLARI */}
                <td>
                  {role === "admin" ? (
                    <>
                      <button onClick={() => updateStatus(o.id, "shipped")}>
                        🚚 Kargoya ver
                      </button>

                      <button
                        onClick={() => updateStatus(o.id, "delivered")}
                        style={{ marginLeft: 5 }}
                      >
                        📦 Teslim edildi
                      </button>
                    </>
                  ) : (
                    <span style={{ color: "gray" }}>Yetkin yok</span>
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

export default Orders;