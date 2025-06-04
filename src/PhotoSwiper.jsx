import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

export default function PhotoGallery({ photos, priceIncrease }) {
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

          return (
            <figure key={idx} style={styles.figure}>
              <Swiper
                modules={[Navigation, Pagination, EffectCoverflow]}
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                slidesPerView="auto"
                navigation
                pagination={{ clickable: true }}
                loop={true}
                coverflowEffect={{
                  rotate: 30,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: true,
                }}
                style={styles.swiper}
              >
                {allImages.map((img, imgIdx) => (
                  <SwiperSlide key={imgIdx} style={styles.swiperSlide}>
                    <img
                      src={img}
                      alt={`Фото ${idx}-${imgIdx}`}
                      style={styles.image}
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <figcaption>
                {info.name}
                <br />
                {(info.price / 100 + priceIncrease).toFixed(2)} грн
              </figcaption>
            </figure>
          );
        })}
      </div>
      <style>{responsiveStyles}</style>
    </div>
  );
}

const styles = {
  galleryContainer: {
    padding: "10px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "16px",
  },
  figure: {
    border: "1px solid #ccc",
    padding: "10px",
    margin: "0",
    textAlign: "center",
    boxSizing: "border-box",
    width: "100%",
  },
  swiper: {
    width: "250px",
    height: "250px",
    margin: "0 auto 10px",
  },
  swiperSlide: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "200px",
  },
  image: {
    width: "100%",
    height: "auto",
    maxWidth: "200px",
    borderRadius: "10px",
  },
};

const responsiveStyles = `
  @media (max-width: 600px) {
    .photo-grid {
      grid-template-columns: repeat(1, 1fr) !important;
    }

    .photo-grid figure {
      width: 100% !important;
    }

    .photo-grid img {
      max-width: 100% !important;
    }
  }
`;
