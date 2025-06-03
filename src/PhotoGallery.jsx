import React, { useState } from "react";

export default function PhotoGallery({ photos, priceIncrease }) {
  const [imageIndexes, setImageIndexes] = useState({});

const handleNextImage = (idx, total) => {
  if (total === 0) return;
  setImageIndexes((prev) => ({
    ...prev,
    [idx]: ((prev[idx] ?? 0) + 1) % total,
  }));
};

const handlePrevImage = (idx, total) => {
  if (total === 0) return;
  setImageIndexes((prev) => ({
    ...prev,
    [idx]: ((prev[idx] ?? 0) - 1 + total) % total,
  }));
};


  return (
    <div className="photo-gallery">
      <h2>Фото товарів</h2>
      <div
        className="photo-grid"
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {photos.map((info, idx) => {
          const additionalImages =
            Array.isArray(info.images)
              ? info.images.map(
                  (img) =>
                    `https://cdn.modniy-ostrov.com/ostrov-cache/sylius_medium/${img}`
                )
              : [];

          const allImages = [info.url, ...additionalImages].filter(Boolean);
          const totalImages = allImages.length;

          if (totalImages === 0) return null;

          const currentIndex = imageIndexes[idx] ?? 0;
          const safeIndex = currentIndex % totalImages;
          const currentImage = allImages[safeIndex] || "/placeholder.png";

          return (
            <figure
              key={idx}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px",
                maxWidth: "220px",
                textAlign: "center",
              }}
            >
              <img
                src={currentImage}
                alt={`Фото ${idx}`}
                style={{ width: "200px", height: "auto" }}
                onError={(e) => {
                  e.target.src = "/placeholder.png";
                }}
              />
              <figcaption>
                {info.name}
                <br />
                {(info.price / 100 + priceIncrease).toFixed(2)} грн
              </figcaption>
              {totalImages > 1 && (
                <div style={{ marginTop: "10px" }}>
                  <button onClick={() => handlePrevImage(idx, totalImages)}>
                    ←
                  </button>
                  <span style={{ margin: "0 10px" }}>
                    {safeIndex + 1}/{totalImages}
                  </span>
                  <button onClick={() => handleNextImage(idx, totalImages)}>
                    →
                  </button>
                </div>
              )}
            </figure>
          );
        })}
      </div>
    </div>
  );
}
