import { useNavigate, Outlet } from "react-router-dom";

function Layout({ onLogout }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

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
        <h3>📦 Depo Panel</h3>

        {/* HERKES GÖRÜR */}
        <button onClick={() => navigate("/dashboard")}>
          🏠 Dashboard
        </button>

        <button onClick={() => navigate("/dashboard/orders")}>
          📦 Siparişler
        </button>

        <button onClick={() => navigate("/dashboard/urunler")}>
              📦 Ürünler
            </button>

        {/* SADECE ADMIN */}
        {role === "admin" && (
          <>
            <button onClick={() => navigate("/dashboard/hareketler")}>
          🔄 Hareketler
        </button>

            <button onClick={() => navigate("/dashboard/create-order")}>
          🧾 Sipariş Oluştur
        </button>

            <button onClick={() => navigate("/dashboard/urunekle")}>
              ➕ Ürün Ekle
            </button>
          </>
        )}

        {/* ÇIKIŞ */}
        <div style={{ marginTop: "auto" }}>
          <button
            onClick={() => {
              onLogout();
              navigate("/");
            }}
            style={{ background: "red", color: "white" }}
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