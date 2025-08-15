import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Якщо у тебе React Router
import "./setFavorite.css";

export default function SetFavoriteButton({ url, price, name, slug, images, oldPrice }) {
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("favorites")) ?? [];
  });
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleFavoriteClick = () => {
    setFavorites((prevFavorites) => {
      let updated;
      if (prevFavorites.find((item) => item.slug == slug)) {
        updated = prevFavorites.filter((item) => item.slug !== slug);
      } else {
        updated = [...prevFavorites, {"url":url, "price":price, "name":name, "slug":slug, "images":images, "oldPrice":oldPrice}];
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000); 
      }
      return updated;
    });
  };

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const isFavorited = favorites.find((item) => item.slug == slug);

  return (
    <>
    <div
      style={{
        zIndex: 1002,
        position: "absolute",
        left: "16%",
        top: "85%",
        cursor: "pointer",
        fontSize: "30px",
        width: "40px",           // ✅ чітка ширина
        height: "40px",          // ✅ чітка висота
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: isFavorited ? "red" : "#aaa",
        transition: "color 0.2s ease",
        userSelect: "none",
        background: "rgba(0,0,0,0.08)",
        borderRadius: "50%",     // тепер завжди коло
      }}
      className="to-favorite"
      onClick={handleFavoriteClick}
      aria-label={isFavorited ? "У обраному" : "Додати в обране"}
    >
      <span className="tooltip-text">
        {isFavorited ? "Прибрати з вподобаних" : "Додати у вподобані"}
      </span>
      {isFavorited ? "❤️" : "🤍"}
  </div>


    {showToast && (
        <div className="toast">
          Переглянути{" "}
          <span
            className="favorites-link"
            onClick={() => navigate("/favorites")}
          >
            вподобані
          </span>
        </div>
      )}
      </>
  );
}


