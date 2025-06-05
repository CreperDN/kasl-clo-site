import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function ProductPage() {
  const { id } = useParams(); // отримуємо :id
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;
  //const product = products[parseInt(id)]; // або знайди по ID

  if (!product) return <p>Товар не знайдено</p>;

  const allImages = [product.url, ...(product.images || []).map(img => `https://cdn.modniy-ostrov.com/ostrov-cache/sylius_medium/${img}`)];

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        ← Назад
      </button>
      <h2>{product.name}</h2>
      {product.oldPrice && (
        <p>
          <s style={{ color: "red" }}>
            {(product.oldPrice / 100).toFixed(2)} грн
          </s>
        </p>
      )}
      <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
        {(product.price / 100).toFixed(2)} грн
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {allImages.map((img, i) => (
          <img key={i} src={img} alt={`Фото ${i}`} style={{ width: "200px" }} />
        ))}
      </div>
    </div>
  );
}
