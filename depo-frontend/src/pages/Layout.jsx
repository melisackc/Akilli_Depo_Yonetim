import { NavLink, Outlet } from "react-router-dom";

function Layout({ onLogout }) {
  const role = localStorage.getItem("role");

  return (
    <div style={styles.wrapper}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>📦 DEPO</div>

        <nav style={styles.nav}>
          <NavItem to="/dashboard" label="Dashboard" />
          <NavItem to="/dashboard/urunler" label="Ürünler" />
          <NavItem to="/dashboard/urunekle" label="Ürün Ekle" />
          <NavItem to="/dashboard/hareketler" label="Hareketler" />
          <NavItem to="/dashboard/create-order" label="Sipariş Oluştur" />
          <NavItem to="/dashboard/orders" label="Siparişler" />
        </nav>

        <div style={styles.footer}>
          <div style={styles.userBox}>
            <div>👤 {localStorage.getItem("username")}</div>
        
          </div>

          <button style={styles.logout} onClick={onLogout}>
            Çıkış
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main style={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}

/* NAV ITEM */
function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        ...styles.link,
        background: isActive ? "#1f2937" : "transparent",
      })}
    >
      {label}
    </NavLink>
  );
}

/* STYLES */
const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Arial",
  },

  sidebar: {
    width: "260px",
    background: "#0f172a",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "20px",
  },

  logo: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "20px",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  link: {
    color: "#cbd5e1",
    textDecoration: "none",
    padding: "10px",
    borderRadius: "8px",
  },

  footer: {
    marginTop: "20px",
  },

  userBox: {
    marginBottom: "10px",
    fontSize: "14px",
    color: "#94a3b8",
  },

  logout: {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
  },

  content: {
    flex: 1,
    background: "#f1f5f9",
    padding: "20px",
  },
};

export default Layout;