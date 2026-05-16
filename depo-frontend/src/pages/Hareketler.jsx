import { useEffect, useState } from "react";
import API from "../services/api";

function Hareketler() {
  const [hareketler, setHareketler] = useState([]);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("ALL");

  const formatDate = (date) => {
    if (!date) return "-";

    if (date?.seconds) {
      return new Date(date.seconds * 1000).toLocaleString();
    }

    return new Date(date).toLocaleString();
  };

  // 🔥 TEK FONKSİYON (HEM NORMAL HEM FİLTRE)
  const fetchData = () => {
    setLoading(true);

    API.get("/reports/movements-filtered", {
      params: {
        startDate,
        endDate,
        type
      }
    })
      .then((res) => {
        console.log("Hareketler:", res.data);
        setHareketler(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  // 🔥 SAYFA İLK AÇILDIĞINDA
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <h3>Yükleniyor...</h3>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Stok Hareketleri</h2>

      {/* 🔥 3. FİLTRE PANELİ */}
      <div style={{ marginBottom: 20 }}>

        <input
          type="date"
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input
          type="date"
          onChange={(e) => setEndDate(e.target.value)}
        />

        <select onChange={(e) => setType(e.target.value)}>
          <option value="ALL">Tümü</option>
          <option value="IN">Giriş</option>
          <option value="OUT">Çıkış</option>
        </select>

        <button onClick={fetchData}>
          Filtrele
        </button>

      </div>

      {/* TABLO */}
      {hareketler.length === 0 ? (
        <p>Hiç hareket yok</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Ürün</th>
              <th>İşlem</th>
              <th>Adet</th>
              <th>Kullanıcı</th>
              <th>Tarih</th>
            </tr>
          </thead>

          <tbody>
            {hareketler.map((h) => (
              <tr key={h.id}>
                <td>{h.productName}</td>
                <td>{h.type}</td>
                <td>{h.quantity}</td>
                <td>{h.user}</td>
                <td>{formatDate(h.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Hareketler;