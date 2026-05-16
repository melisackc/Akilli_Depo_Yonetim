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

  useEffect(() => {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    API.get("/dashboard", { headers })
      .then((res) => {
        setSummary({
          totalProducts: res.data.totalProducts,
          totalStock: res.data.totalStock,
          criticalCount: res.data.criticalCount,
        });

        setCriticalProducts(res.data.criticalProducts);
        setRecentMovements(res.data.recentMovements);
      })
      .catch((err) => console.log(err));

    API.get("/reports/auto-orders", { headers })
      .then((res) => setOrders(res.data))
      .catch((err) => console.log(err));
  }, []);

  const chartData = {
    labels: criticalProducts.map((p) => p.name),
    datasets: [
      {
        label: "Stok",
        data: criticalProducts.map((p) => p.stock),
        backgroundColor: [
          "#ff6384",
          "#36a2eb",
          "#ffce56",
          "#8e44ad",
          "#2ecc71",
        ],
      },
    ],
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>📊 Dashboard</h2>

      {/* TOP CARDS */}
      <div style={styles.cardRow}>
        <div style={styles.card}>
          <h3>Toplam Ürün</h3>
          <h2>{summary.totalProducts}</h2>
        </div>

        <div style={styles.card}>
          <h3>Toplam Stok</h3>
          <h2>{summary.totalStock}</h2>
        </div>

        <div style={{ ...styles.card, border: "2px solid red" }}>
          <h3>Kritik Ürün</h3>
          <h2>{summary.criticalCount}</h2>
        </div>
      </div>

      {/* GRID SECTION */}
      <div style={styles.grid}>
        {/* CHART */}
        <div style={styles.box}>
          <h3>📊 Kritik Ürün Dağılımı</h3>
          {criticalProducts.length === 0 ? (
            <p>Veri yok</p>
          ) : (
            <Pie data={chartData} />
          )}
        </div>

        {/* AUTO ORDERS */}
        <div style={styles.box}>
          <h3>📦 Sipariş Gerekenler</h3>
          {orders.length === 0 ? (
            <p>Yok</p>
          ) : (
            orders.map((o) => (
              <div key={o.productId} style={styles.listItem}>
                {o.productName} - {o.stock}
              </div>
            ))
          )}
        </div>

        {/* CRITICAL */}
        <div style={styles.box}>
          <h3>⚠️ Kritik Ürünler</h3>
          {criticalProducts.length === 0 ? (
            <p>Yok</p>
          ) : (
            criticalProducts.map((p) => (
              <div key={p.id} style={styles.listItem}>
                {p.name} - {p.stock}
              </div>
            ))
          )}
        </div>

        {/* MOVEMENTS */}
        <div style={styles.box}>
          <h3>🔄 Son Hareketler</h3>
          {recentMovements.length === 0 ? (
            <p>Yok</p>
          ) : (
            recentMovements.map((m) => (
              <div key={m.id} style={styles.listItem}>
                {m.productName} - {m.type} - {m.quantity}
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
    background: "#f4f6f8",
    minHeight: "100vh",
  },

  title: {
    marginBottom: 20,
  },

  cardRow: {
    display: "flex",
    gap: 20,
    marginBottom: 20,
  },

  card: {
    flex: 1,
    background: "white",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    transition: "0.2s",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 15,
  },

  box: {
    background: "white",
    padding: 15,
    borderRadius: 12,
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },

  listItem: {
    padding: 8,
    borderBottom: "1px solid #eee",
  },
};

export default Dashboard;