import { useEffect, useState } from "react";

export default function SetFavoriteButton({ slug }) {
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("favorites")) ?? [];
  });

  const handleFavoriteClick = () => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(slug)) {
        return prevFavorites.filter((item) => item !== slug);
      } else {
        return [...prevFavorites, slug];
      }
    });
  };

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const isFavorited = favorites.includes(slug);

  return (
    <div
      style={{
        zIndex:1002,
        position: "absolute",
        left: "16%",
        top: "85%",
        cursor: "pointer",
        fontSize: "30px",
        width: "auto",
        color: isFavorited ? "red" : "#aaa",
        transition: "color 0.2s ease",
        userSelect: "none",
        background: "rgba(0,0,0,0.08)",
        borderRadius: "50%",
      }}
      onClick={handleFavoriteClick}
      aria-label={isFavorited ? "У обраному" : "Додати в обране"}
    >
      {isFavorited ? "❤️" : "🤍"}
    </div>
  );
}
