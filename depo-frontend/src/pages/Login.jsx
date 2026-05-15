import { useState } from "react";
import API from "../services/api";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
  try {
    const res = await API.post("http://localhost:5000/login", {
      username,
      password,
    });

    console.log("LOGIN RESPONSE:", res.data);

    onLogin(res.data);
  } catch (err) {
    console.log("LOGIN ERROR:", err.response?.data || err.message);
    alert("Giriş başarısız");
  }
};

  return (
    <div style={{ padding: 40 }}>
      <h1>Depo Yönetim Sistemi</h1>

      <input
  type="text"
  placeholder="Kullanıcı Adı"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>

      <br /><br />

      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={login}>Giriş Yap</button>
    </div>
  );
}

export default Login;