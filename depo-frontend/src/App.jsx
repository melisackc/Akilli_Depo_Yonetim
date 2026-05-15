import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./pages/Layout";

import Urunler from "./pages/Urunler";
import UrunEkle from "./pages/UrunEkle";
import Hareketler from "./pages/Hareketler";

function App() {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    return token ? { token, username, role } : null;
  });

  const handleLogin = (data) => {
    const authData = {
      token: data.token,
      username: data.username || data.user?.username,
      role: data.role || data.user?.role,
    };

    localStorage.setItem("token", authData.token);
    localStorage.setItem("username", authData.username);
    localStorage.setItem("role", authData.role);

    setAuth(authData);
  };

  const handleLogout = () => {
    localStorage.clear();
    setAuth(null);
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/"
          element={
            auth ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        {/* LAYOUT + DASHBOARD SYSTEM */}
        <Route
          path="/dashboard/*"
          element={
            auth ? (
              <Layout onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        >
          {/* ALT SAYFALAR */}
          <Route index element={<Dashboard auth={auth} />} />
          <Route path="urunler" element={<Urunler />} />
          <Route path="urunekle" element={<UrunEkle />} />
          <Route path="hareketler" element={<Hareketler />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;