import { useEffect, useState } from "react";
import API from "../services/api";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalStock: 0,
    criticalCount: 0,
  });

  const [criticalProducts, setCriticalProducts] = useState([]);
  const [recentMovements, setRecentMovements] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // ================= LOAD DATA =================
  const loadData = async () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [dashboardRes, autoRes] = await Promise.all([
        API.get("/dashboard", { headers }),
        API.get("/reports/auto-orders", { headers }),
      ]);

      const dashboard = dashboardRes.data || {};

      setSummary({
        totalProducts: dashboard.totalProducts || 0,
        totalStock: dashboard.totalStock || 0,
        criticalCount: dashboard.criticalCount || 0,
      });

      const critical = dashboard.criticalProducts || [];
      setCriticalProducts(critical);
      setRecentMovements(dashboard.recentOrders || dashboard.recentMovements || []);
      setOrders(autoRes.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= INIT & POLLING =================
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        setPageLoading(true);
        await loadData();
      } finally {
        if (mounted) setPageLoading(false);
      }
    };

    init();

    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      if (mounted) loadData();
    }, 10000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // ================= AUTO ORDER =================
  const createAutoOrders = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.post("/orders/auto-create", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.message || "Otomatik siparişler oluşturuldu!");
      await loadData();
    } catch (err) {
      toast.error("Hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // ================= RUN AI OPTIMIZATION =================
  const runAIOptimization = async () => {
    if (optimizing) return;
    
    if (isOptimized) {
      toast.info("✅ Sistem zaten en optimum seviyede çalışıyor!");
      return;
    }

    try {
      setOptimizing(true);
      const token = localStorage.getItem("token");
      await API.post("/api/optimize", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✨ Yapay Zeka stok seviyelerini optimize etti!");
      setIsOptimized(true);
      
      // Allow re-optimization after 3 minutes so it's not locked forever
      setTimeout(() => setIsOptimized(false), 180000); 

      await loadData();
    } catch (err) {
      toast.error("AI Optimizasyonu sırasında hata oluştu. AI servisinin çalıştığından emin olun.");
    } finally {
      setOptimizing(false);
    }
  };

  const chartData = {
    labels: criticalProducts.map((p) => p.name),
    datasets: [
      {
        label: "Stok",
        data: criticalProducts.map((p) => p.stock),
        backgroundColor: ["#f43f5e", "#0ea5e9", "#f59e0b", "#10b981", "#8b5cf6"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: { font: { family: 'Inter', size: 12 }, color: '#64748b' }
      }
    }
  };

  if (pageLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)' }}>
        <h2 className="animate-fade-in">Yükleniyor... ⏳</h2>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <ToastContainer position="top-right" autoClose={3000} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Dashboard</h1>
          <p>Deponuzun genel durumunu gerçek zamanlı takip edin.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" onClick={runAIOptimization} disabled={optimizing}>
            {optimizing ? "⏳ Optimize ediliyor..." : "✨ AI Optimizasyonu"}
          </button>
        </div>
      </div>

      {/* CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>Toplam Ürün</div>
          <div style={{ fontSize: '36px', fontWeight: '700', color: 'var(--primary)' }}>{summary.totalProducts}</div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>Toplam Stok</div>
          <div style={{ fontSize: '36px', fontWeight: '700', color: 'var(--secondary)' }}>{summary.totalStock}</div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderLeft: summary.criticalCount > 0 ? '4px solid var(--danger)' : '4px solid var(--success)' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>Kritik Ürünler</div>
          <div style={{ fontSize: '36px', fontWeight: '700', color: summary.criticalCount > 0 ? 'var(--danger)' : 'var(--text-main)' }}>
            {summary.criticalCount} {summary.criticalCount > 0 && "⚠️"}
          </div>
        </div>
      </div>

      {/* GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        
        {/* CHART */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ width: '100%', marginBottom: '16px' }}>Kritik Ürün Dağılımı</h3>
          {criticalProducts.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              Harika! Kritik ürün yok. 🎉
            </div>
          ) : (
            <div style={{ width: '250px', height: '250px' }}>
              <Pie data={chartData} options={chartOptions} />
            </div>
          )}
        </div>

        {/* RECENT ORDERS */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>Son Siparişler</h3>
          {recentMovements.length === 0 ? (
            <p>Henüz sipariş yok.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentMovements.map((m) => (
                <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{m.user || 'Sistem (Otomatik)'}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {m.createdAt 
                        ? new Date(m.createdAt._seconds ? m.createdAt._seconds * 1000 : (m.createdAt.seconds ? m.createdAt.seconds * 1000 : m.createdAt)).toLocaleString() 
                        : (m.date ? new Date(m.date._seconds ? m.date._seconds * 1000 : (m.date.seconds ? m.date.seconds * 1000 : m.date)).toLocaleString() : '-')}
                    </span>
                  </div>
                  <span className={`badge ${m.status === 'delivered' ? 'badge-success' : (m.status === 'shipped' || m.type === 'IN') ? 'badge-warning' : 'badge-danger'}`}>
                    {m.status || m.type || 'Bekliyor'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;