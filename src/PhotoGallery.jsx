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
    <div className="photo-gallery" style={styles.galleryContainer}>
      <h2 style={{ textAlign: "center" }}>Фото товарів</h2>
      <div className="photo-grid" style={styles.grid}>
        {photos.map((info, idx) => {
          const additionalImages = Array.isArray(info.images)
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
            <figure key={idx} style={styles.figure}>
              <img
                src={currentImage}
                alt={`Фото ${idx}`}
                style={styles.image}
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
                  <button style={styles.navButton} onClick={() => handlePrevImage(idx, totalImages)}>←</button>
                  <span style={styles.navInfo}>
                    {safeIndex + 1}/{totalImages}
                  </span>
                  <button style={styles.navButton} onClick={() => handleNextImage(idx, totalImages)}>→</button>
                </div>
              )}
            </figure>
          );
        })}
      </div>
      <style>{responsiveStyles}</style>
    </div>
  );
}

const styles = {
  navButton: {
  fontSize: "1.2rem",
  padding: "8px 16px",
  margin: "0 5px",
  cursor: "pointer",
  borderRadius: "6px",
  border: "1px solid #888",
  transition: "background-color 0.2s",
},
navInfo: {
  fontSize: "1rem",
  margin: "0 10px",
  minWidth: "50px",
  display: "inline-block",
  textAlign: "center",
},

  galleryContainer: {
    padding: "10px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "16px",
  },
  figure: {
    border: "1px solid #ccc",
    padding: "10px",
    margin: "10px",
    width: "220px",
    textAlign: "center",
    boxSizing: "border-box",
  },
  image: {
    width: "100%",
    height: "auto",
    maxWidth: "200px",
  },
};

const responsiveStyles = `
  @media (max-width: 600px) {
    .photo-grid {
      flex-direction: column;
      align-items: center;
    }

    .photo-grid figure {
      width: 90% !important;
    }

    .photo-grid img {
      max-width: 100% !important;
    }
  }
`;
