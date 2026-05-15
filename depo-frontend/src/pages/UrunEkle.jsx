import { useState } from "react";
import API from "../services/api";

function UrunEkle() {
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      await API.post("/products", {
        name,
        stock: Number(stock),
        price: Number(price),
      });

      setMessage("Ürün eklendi ✔");

      // inputları temizle
      setName("");
      setStock("");
      setPrice("");
    } catch (err) {
      console.log(err);
      setMessage("Hata oluştu ❌");
    }
  };

  return (
    <div>
      <h2>➕ Ürün Ekle</h2>

      <input
        placeholder="Ürün adı"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Stok"
        type="number"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Fiyat"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSubmit}>
        Kaydet
      </button>

      <p>{message}</p>
    </div>
  );
}

export default UrunEkle;