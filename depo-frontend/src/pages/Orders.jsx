import { useEffect, useState } from "react";
import API from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const role = localStorage.getItem("role");

  const fetchOrders = () => {
    const token = localStorage.getItem("token");

    API.get("/api/orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setOrders(res.data))
      .catch((err) => toast.error("Siparişler yüklenemedi"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
    // Auto-refresh every 15 seconds
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = (id, status) => {
    const token = localStorage.getItem("token");

    API.put(
      `/api/orders/${id}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => {
        toast.success("Sipariş durumu güncellendi");
        fetchOrders();
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Durum güncellenirken hata oluştu");
      });
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)' }}>
      <h2 className="animate-fade-in">Yükleniyor... ⏳</h2>
    </div>
  );

  const getStatusBadge = (status) => {
    if (status === "delivered") return <span className="badge badge-success">Teslim Edildi</span>;
    if (status === "shipped") return <span className="badge badge-warning">Kargoda</span>;
    if (status === "auto-created") return <span className="badge" style={{background: '#e0f2fe', color: '#0284c7'}}>Otomatik</span>;
    return <span className="badge">{status}</span>;
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (o.user || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <ToastContainer position="top-right" autoClose={3000} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>Siparişler</h1>
          <p>Tüm siparişleri görüntüleyin ve durumlarını yönetin.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', flex: '1', maxWidth: '300px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Sipariş ID veya Kullanıcı ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto', padding: '1px' }}>
        {orders.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Henüz hiç sipariş yok.
          </div>
        ) : (
          <table className="modern-table">
            <thead>
              <tr>
                <th>Sipariş ID</th>
                <th>İçerik</th>
                <th>Durum</th>
                <th>Kullanıcı</th>
                <th>Tarih</th>
                {role === "admin" && <th>İşlemler</th>}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {o.id.substring(0, 8)}...
                  </td>

                  <td>
                    {o.products?.map((p, i) => (
                      <div key={i} style={{ fontSize: '0.9rem' }}>
                        <span style={{ fontWeight: '500' }}>{p.name}</span> <span style={{ color: 'var(--text-muted)' }}>({p.qty} adet)</span>
                      </div>
                    ))}
                  </td>

                  <td>
                    {getStatusBadge(o.status)}
                  </td>

                  <td>
                    <span style={{ fontWeight: '500' }}>{o.user}</span>
                  </td>

                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {o.createdAt
                      ? new Date(
                          o.createdAt._seconds
                            ? o.createdAt._seconds * 1000
                            : (o.createdAt.seconds ? o.createdAt.seconds * 1000 : o.createdAt)
                        ).toLocaleString()
                      : "-"}
                  </td>

                  {role === "admin" && (
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {o.status !== "shipped" && o.status !== "delivered" && (
                          <button 
                            className="btn btn-outline" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', borderColor: 'var(--warning)', color: 'var(--warning)' }}
                            onClick={() => updateStatus(o.id, "shipped")}
                          >
                            🚚 Kargola
                          </button>
                        )}
                        {o.status !== "delivered" && (
                          <button 
                            className="btn btn-outline" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', borderColor: 'var(--success)', color: 'var(--success)' }}
                            onClick={() => updateStatus(o.id, "delivered")}
                          >
                            📦 Teslim Et
                          </button>
                        )}
                        {o.status === "delivered" && (
                          <span style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: '500' }}>Tamamlandı</span>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={role === "admin" ? "6" : "5"} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>Sonuç bulunamadı</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Orders;