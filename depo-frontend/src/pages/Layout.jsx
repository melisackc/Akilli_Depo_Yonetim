import { useNavigate, Outlet } from "react-router-dom";

function Layout({ onLogout }) {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* SIDEBAR */}
      <div
        style={{
          width: 220,
          background: "#1e1e2f",
          color: "white",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}
      >
        <h3 style={{ marginBottom: 10 }}>📦 Depo Panel</h3>

        <button onClick={() => navigate("/dashboard")}>
          🏠 Dashboard
        </button>

        <button onClick={() => navigate("/dashboard/urunler")}>
          📦 Ürünler
        </button>

        <button onClick={() => navigate("/dashboard/urunekle")}>
          ➕ Ürün Ekle
        </button>

        <button onClick={() => navigate("/dashboard/hareketler")}>
          🔄 Hareketler
        </button>

        <div style={{ marginTop: "auto" }}>
          <button
            onClick={() => {
              onLogout();
              navigate("/");
            }}
            style={{
              background: "red",
              color: "white"
            }}
          >
            🚪 Çıkış
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, padding: 20, overflow: "auto" }}>
        <Outlet />
      </div>

    </div>
  );
}

export default Layout;