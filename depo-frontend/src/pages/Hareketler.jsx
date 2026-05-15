import { useEffect, useState } from "react";
import API from "../services/api";

function Hareketler() {
  const [hareketler, setHareketler] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/hareketler")
      .then((res) => {
        console.log("Hareketler:", res.data);
        setHareketler(res.data);
      })
      .catch((err) => {
        console.log("Hata:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h3>Yükleniyor...</h3>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Stok Hareketleri</h2>

      {hareketler.length === 0 ? (
        <p>Hiç hareket yok</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Ürün</th>
              <th>İşlem</th>
              <th>Adet</th>
              <th>Tarih</th>
            </tr>
          </thead>

          <tbody>
            {hareketler.map((h, i) => (
              <tr key={i}>
                <td>{h.urunAdi}</td>
                <td>{h.islem}</td>
                <td>{h.adet}</td>
                <td>
                  {h.tarih
                    ? new Date(h.tarih).toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Hareketler;