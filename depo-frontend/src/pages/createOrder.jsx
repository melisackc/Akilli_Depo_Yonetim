import { useEffect, useState } from "react";
import API from "../services/api";

function CreateOrder() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    API.get("/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  const createOrder = () => {
    const token = localStorage.getItem("token");

    const product = products.find((p) => p.id === selectedProduct);

    if (!product) {
      setMessage("Ürün seçilmedi");
      return;
    }

    const orderData = {
      products: [
        {
          id: product.id,
          name: product.name,
          qty: quantity,
        },
      ],
      totalPrice: 0,
    };

    API.post("/api/orders", orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        setMessage("✅ Sipariş oluşturuldu");
        setQuantity(1);
        setSelectedProduct("");
      })
      .catch(() => setMessage("❌ Hata oluştu"));
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>🧾 Sipariş Oluştur</h2>

      <div style={boxStyle}>
        <label>Ürün Seç:</label>
        <br />

        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          style={{ padding: 10, width: "100%" }}
        >
          <option value="">-- Ürün Seç --</option>

          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (Stok: {p.stock})
            </option>
          ))}
        </select>

        <br /><br />

        <label>Adet:</label>
        <input
          type="number"
          value={quantity}
          min={1}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{ padding: 10, width: "100%" }}
        />

        <br /><br />

        <button onClick={createOrder} style={btnStyle}>
          Sipariş Oluştur
        </button>

        <p>{message}</p>
      </div>
    </div>
  );
}

const boxStyle = {
  border: "1px solid #ddd",
  padding: 20,
  borderRadius: 10,
  background: "white",
  maxWidth: 400,
};

const btnStyle = {
  padding: 10,
  width: "100%",
  background: "green",
  color: "white",
  border: "none",
  borderRadius: 5,
  cursor: "pointer",
};

export default CreateOrder;