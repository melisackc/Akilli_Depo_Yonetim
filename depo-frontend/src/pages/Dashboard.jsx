import { useEffect, useState } from "react";
import API from "../services/api";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

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
  const [pageLoading, setPageLoading] = useState(true);

  // ================= SAFE LOAD =================
  const loadData = async () => {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

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

    setCriticalProducts(dashboard.criticalProducts || []);
    setRecentMovements(dashboard.recentMovements || []);
    setOrders(autoRes.data || []);
  };

  // ================= INIT =================
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        setPageLoading(true);

        await loadData();

      } catch (err) {
        console.log(err);
      } finally {
        if (mounted) setPageLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  // ================= AUTO ORDER =================
  const createAutoOrders = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await API.post(
        "/orders/auto-create",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);

      await loadData();

    } catch (err) {
      console.log(err);
      alert("Hata oluştu");

    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: criticalProducts.map((p) => p.name),
    datasets: [
      {
        label: "Stok",
        data: criticalProducts.map((p) => p.stock),
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#8e44ad", "#2ecc71"],
      },
    ],
  };

  if (pageLoading) {
    return <div style={{ padding: 20 }}>Yükleniyor...</div>;
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>📊 Dashboard</h2>

      {/* TOP CARDS */}
      <div style={styles.cardRow}>
        <div style={styles.card}>
          <h4>📦 Toplam Ürün</h4>
          <h2>{summary.totalProducts}</h2>
        </div>

        <div style={styles.card}>
          <h4>📊 Toplam Stok</h4>
          <h2>{summary.totalStock}</h2>
        </div>

        <div style={{
          ...styles.card,
          background: summary.criticalCount > 0 ? "#fee2e2" : "#dcfce7",
        }}>
          <h4>⚠️ Kritik Ürün</h4>
          <h2>{summary.criticalCount}</h2>
        </div>
      </div>

      {/* BUTTON */}
      <button
        onClick={createAutoOrders}
        disabled={loading}
        style={{
          ...styles.autoBtn,
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Oluşturuluyor..." : "🤖 Auto Order"}
      </button>

      {/* GRID */}
      <div style={styles.grid}>

        <div style={styles.box}>
          <h3>📊 Kritik Ürün Dağılımı</h3>
          {criticalProducts.length === 0 ? (
            <p>Veri yok</p>
          ) : (
            <Pie data={chartData} />
          )}
        </div>

        <div style={styles.box}>
          <h3>📦 Sipariş Gerekenler</h3>
          {orders.length === 0 ? (
            <p>Yok</p>
          ) : (
            orders.map((o) => (
              <div key={o.productId} style={styles.item}>
                <span>{o.productName}</span>
                <span style={styles.badge}>{o.stock}</span>
              </div>
            ))
          )}
        </div>

        <div style={styles.box}>
          <h3>⚠️ Kritik Ürünler</h3>
          {criticalProducts.length === 0 ? (
            <p>Yok</p>
          ) : (
            criticalProducts.map((p) => (
              <div key={p.id} style={styles.item}>
                <span>{p.name}</span>
                <span style={styles.badgeRed}>{p.stock}</span>
              </div>
            ))
          )}
        </div>

        <div style={styles.box}>
          <h3>🔄 Son Hareketler</h3>
          {recentMovements.length === 0 ? (
            <p>Yok</p>
          ) : (
            recentMovements.map((m) => (
              <div key={m.id} style={styles.item}>
                <span>{m.productName} - {m.type}</span>
                <span>{m.quantity}</span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: 20,
    fontFamily: "Arial",
    background: "#f8fafc",
    minHeight: "100vh",
  },

  title: { marginBottom: 20 },

  cardRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 15,
    marginBottom: 20,
  },

  card: {
    background: "white",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 15,
  },

  box: {
    background: "white",
    padding: 15,
    borderRadius: 12,
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #eee",
  },

  badge: {
    background: "#e0f2fe",
    padding: "2px 8px",
    borderRadius: 8,
    fontSize: 12,
  },

  badgeRed: {
    background: "#fee2e2",
    padding: "2px 8px",
    borderRadius: 8,
    fontSize: 12,
  },

  autoBtn: {
    marginBottom: 15,
    padding: "10px 15px",
    border: "none",
    borderRadius: 8,
    background: "#111827",
    color: "white",
    cursor: "pointer",
  },
};

export default Dashboard;