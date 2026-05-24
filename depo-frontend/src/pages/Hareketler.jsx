import { useEffect, useState } from "react";
import API from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Hareketler() {
  const [hareketler, setHareketler] = useState([]);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("ALL");

  const formatDate = (date) => {
    if (!date) return "-";
    if (date?._seconds) return new Date(date._seconds * 1000).toLocaleString();
    if (date?.seconds) return new Date(date.seconds * 1000).toLocaleString();
    return new Date(date).toLocaleString();
  };

  const fetchData = () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    API.get("/reports/movements", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        setHareketler(res.data);
      })
      .catch((err) => toast.error("Hareketler yüklenemedi"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)' }}>
      <h2 className="animate-fade-in">Yükleniyor... ⏳</h2>
    </div>
  );

  // Frontend Filtering
  const filteredData = hareketler.filter(h => {
    if (type !== "ALL" && h.type !== type) return false;
    
    const hDate = h.date ? new Date(h.date._seconds ? h.date._seconds * 1000 : (h.date.seconds ? h.date.seconds * 1000 : h.date)) : new Date();
    
    if (startDate) {
      const sDate = new Date(startDate);
      sDate.setHours(0, 0, 0, 0);
      if (hDate < sDate) return false;
    }
    
    if (endDate) {
      const eDate = new Date(endDate);
      eDate.setHours(23, 59, 59, 999);
      if (hDate > eDate) return false;
    }
    
    return true;
  });

  // Sort by date descending
  filteredData.sort((a, b) => {
    const timeA = a.date ? (a.date._seconds || a.date.seconds || new Date(a.date).getTime() / 1000) : 0;
    const timeB = b.date ? (b.date._seconds || b.date.seconds || new Date(b.date).getTime() / 1000) : 0;
    return timeB - timeA;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <ToastContainer position="top-right" autoClose={3000} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>Stok İşlem Kayıtları</h1>
          <p>Depodaki tüm giriş (tedarik) ve çıkış (satış) işlemlerinin denetim günlüğü.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Başlangıç</label>
          <input
            type="date"
            className="input-field"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Bitiş</label>
          <input
            type="date"
            className="input-field"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>İşlem Tipi</label>
          <select 
            className="input-field" 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="ALL">Tümü</option>
            <option value="IN">Giriş (IN)</option>
            <option value="OUT">Çıkış (OUT)</option>
          </select>
        </div>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto', padding: '1px' }}>
        {filteredData.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Belirtilen kriterlerde hareket bulunamadı.
          </div>
        ) : (
          <table className="modern-table">
            <thead>
              <tr>
                <th>Ürün Adı</th>
                <th>İşlem</th>
                <th>Miktar</th>
                <th>Kullanıcı</th>
                <th>Tarih</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((h) => (
                <tr key={h.id}>
                  <td style={{ fontWeight: '500' }}>{h.productName}</td>
                  <td>
                    <span className={`badge ${h.type === 'IN' ? 'badge-success' : 'badge-danger'}`}>
                      {h.type === 'IN' ? 'Tedarik (Giriş)' : 'Satış (Çıkış)'}
                    </span>
                  </td>
                  <td style={{ fontWeight: '600', color: h.type === 'IN' ? 'var(--success)' : 'var(--danger)' }}>
                    {h.type === 'IN' ? '+' : '-'}{h.quantity}
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{h.user || 'Sistem'}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{formatDate(h.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Hareketler;