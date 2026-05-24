import { NavLink, Outlet } from "react-router-dom";
import { isAdmin } from "../utils/auth";

function Layout({ onLogout }) {
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-color)" }}>
      {/* SIDEBAR */}
      <aside className="glass-panel" style={{ width: "260px", margin: "16px", padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderRadius: "16px", background: "linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.95) 100%)", color: "white", border: "none" }}>

        <div>
          <div style={{ fontSize: "24px", fontWeight: "700", marginBottom: "32px", color: "white", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "28px" }}>📦</span> Akıllı Depo
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <NavItem to="/dashboard" label="📊 Dashboard" />
            <NavItem to="/dashboard/urunler" label="📦 Ürünler" />
            {isAdmin() && <NavItem to="/dashboard/urunekle" label="➕ Ürün Ekle" />}
            {isAdmin() && <NavItem to="/dashboard/hareketler" label="🔄 Hareketler (Giriş/Çıkış)" />}
            <NavItem to="/dashboard/create-order" label="🛒 Sipariş Oluştur" />
            <NavItem to="/dashboard/orders" label="📋 Siparişler" />
          </nav>
        </div>

        <div style={{ marginTop: "auto" }}>
          <div style={{ padding: "16px", background: "rgba(255,255,255,0.1)", borderRadius: "12px", marginBottom: "16px" }}>
            <div style={{ fontSize: "14px", color: "#cbd5e1" }}>Hoş geldin,</div>
            <div style={{ fontSize: "16px", fontWeight: "600", color: "white" }}>{username}</div>
            <div style={{ fontSize: "12px", color: "var(--secondary)", marginTop: "4px", textTransform: "uppercase" }}></div>
          </div>

          <button className="btn btn-danger" style={{ width: "100%", justifyContent: "center" }} onClick={onLogout}>
            Çıkış Yap 🚪
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main style={{ flex: 1, padding: "24px 32px 24px 8px", overflowY: "auto" }}>
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      end={to === "/dashboard"}
      style={({ isActive }) => ({
        textDecoration: "none",
        padding: "12px 16px",
        borderRadius: "10px",
        color: isActive ? "white" : "#94a3b8",
        background: isActive ? "var(--primary)" : "transparent",
        fontWeight: isActive ? "600" : "500",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
      })}
    >
      {label}
    </NavLink>
  );
}

export default Layout;