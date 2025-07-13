import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import { Link, useLocation } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

export default function PhotoGallery({ products, priceIncrease }) {

  const location = useLocation();
  products = Array.isArray(products) ? products : [products];
  return (
    <div className="photo-gallery" style={styles.galleryContainer}>
      <div className="photo-grid" style={styles.grid}>
    <>
      {products.map((product) => {
        

        const images = [product.url, ...(product.images || []).map(img =>
          `https://cdn.modniy-ostrov.com/ostrov-cache/sylius_medium/${img}`
        )];

        return (
          <figure key={product.hash} style={styles.figure}>
            <Swiper
              modules={[Navigation, Pagination, EffectCoverflow]}
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView= "1"
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
              {images.map((img, imgIdx) => (
                <SwiperSlide key={imgIdx} style={styles.swiperSlide}>
                  <Link
                    to={`/product/${product.slug}`}
                    onClick={() => location.pathname === "/" &&
                      sessionStorage.setItem(
                        "scrollPosition",
                        (window.scrollY+0.7).toString()
                      )
                    }
                  >
                    <img
                      src={img}
                      alt={`Фото ${product.name}-${imgIdx}`}
                      style={styles.image}
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
            <figcaption style = {{lineHeight:"1.2"}}>
              <small>{product.name}</small>
              <br />
              {product.oldPrice != null ? (
                <>
                  <s style={{ color: "gray", marginRight: "8px" }}>
                    {(product.oldPrice / 100 + priceIncrease).toFixed(2)} грн
                  </s>
                  <strong>
                    {(product.price / 100 + priceIncrease).toFixed(2)} грн
                  </strong>
                </>
              ) : (
                <strong>
                  {(product.price / 100 + priceIncrease).toFixed(2)} грн
                </strong>
              )}
            </figcaption>
          </figure>
        );
      })}
      <style>{responsiveStyles}</style>
    </>
          </div>
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
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
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
    width: "300px",
    margin: "0 auto 5px",
  },
  swiperSlide: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "250px",
  },
  image: {
    width: "100%",
    height: "auto",
    maxWidth: "250px",
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
