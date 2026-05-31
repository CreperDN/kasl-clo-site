import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import { Link, useLocation } from "react-router-dom";
import SetFavoriteButton from "./setFavorite";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { PRICE_INCREASE, PRICE_DECREASE as priceDecrease, isCheaper } from "./priceHelper";

export default function PhotoGallery({ products, priceIncrease = PRICE_INCREASE, handleGoToProduct }) {
  const location = useLocation();

  products = Array.isArray(products) ? products : [products];

  return (
    <div style={styles.galleryContainer}>
      <div style={styles.grid}>
        {products.map((product, i) => {

          const images = [
            product.url,
            ...(product.images || []).map(
              img => `https://cdn.modniy-ostrov.com/ostrov-cache/sylius_medium/${img}`
            )
          ];
          while(images.length < 4){images.forEach(image =>images.push(image))}

          return (
            <figure key={product.slug + i} style={styles.figure}>

              <Swiper
              modules={[Navigation, Pagination, EffectCoverflow]}
              effect="coverflow"
              onInit={(swiper) => {
                const prev = swiper.el.querySelector(".swiper-button-prev");
                const next = swiper.el.querySelector(".swiper-button-next");

                [prev, next].forEach((btn) => {
                  if (btn) {
                    btn.style.width = "60px";
                    btn.style.height = "122%";
                    btn.style.top = "-0px";
                    btn.style.bottom = "0";
                    btn.style.background = "rgba(0,0,0,0.08)";
                    btn.style.display = "flex";
                    btn.style.alignItems = "center";
                    btn.style.justifyContent = "center";
                    btn.style.color = "#fff";
                    btn.style.fontSize = "8px";
                    btn.style.pointerEvents = "auto";
                    }
                  });

                if (prev) prev.style.left = "-14px";
                if (next) next.style.right = "-14px";
              }}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={1.2} // дозволяє частково показати сусідні
              loop={true}
              navigation
              pagination={{ clickable: true }}
              coverflowEffect={{
                rotate: 30,
                stretch: 0,
                depth: 500,
                modifier: 0,
                slideShadows: true,
              }}
            >

              {images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <Link
                      to={`/product/${product.slug}`}
                      onClick={() => {
                        if (location.pathname === "/") {
                          sessionStorage.setItem("scrollPosition", window.scrollY.toString());
                        }
                        if (handleGoToProduct) handleGoToProduct();
                      }}
                    >
                      <div style={styles.imageWrapper}>
                        <img
                          src={img}
                          width="464"
                          height="616"
                          loading="lazy"
                          decoding="async"
                          alt={`Фото ${product.name}`}
                          onError={(e) => e.currentTarget.src = "/placeholder.png"}
                          style={styles.image}
                        />
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}

                <SetFavoriteButton
                  url={product.url}
                  price={product.price}
                  name={product.name}
                  slug={product.slug}
                  images={product.images}
                  oldPrice={product.oldPrice}
                />
              </Swiper>

              <figcaption style={styles.caption}>
                <small>{product.name}</small><br />

                {product.oldPrice != null ? (
                  isCheaper(product.slug) ? (
                    <>
                      <s style={styles.oldPrice}>
                        {(product.oldPrice / 100 + priceIncrease - priceDecrease).toFixed(2)} грн
                      </s>
                      <strong>
                        {(product.price / 100 + priceIncrease - priceDecrease).toFixed(2)} грн
                      </strong>
                    </>
                  ) : (
                    <>
                      <s style={styles.oldPrice}>
                        {(product.oldPrice / 100 + priceIncrease).toFixed(2)} грн
                      </s>
                      <strong>
                        {(product.price / 100 + priceIncrease).toFixed(2)} грн
                      </strong>
                    </>
                  )
                ) : (
                  isCheaper(product.slug) ? (
                    <strong>
                      {(product.price / 100 + priceIncrease - priceDecrease).toFixed(2)} грн
                    </strong>
                  ) : (
                    <strong>
                      {(product.price / 100 + priceIncrease).toFixed(2)} грн
                    </strong>
                  )
                )}
              </figcaption>

            </figure>
          );
        })}
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
    margin: 0,
    textAlign: "center",
    boxSizing: "border-box",
    width: "100%",
    maxWidth: "350px",
    justifySelf: "center",
    overflow: "hidden"
  },

  imageWrapper: {
    width: "100%",
    aspectRatio: "464 / 616",
    backgroundColor: "#2a2a2a",
    borderRadius: "12px",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    userSelect:"none"
  },

  caption: {
    lineHeight: "1.2",
    marginTop: "6px",
  },

  oldPrice: {
    color: "gray",
    marginRight: "8px",
  },
};
