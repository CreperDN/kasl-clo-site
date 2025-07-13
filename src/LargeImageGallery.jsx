import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "swiper/css";
import "swiper/css/navigation";

export default function LargeImageGallery({ product }) {
  const images = [
    product.url,
    ...(product.images || []).map(
      (img) => `https://cdn.modniy-ostrov.com/ostrov-cache/sylius_medium/${img}`
    ),
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const modalSwiperRef = useRef(null);

  const openModal = (index) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <>
      {/* Галерея */}
      <div style={styles.galleryContainer}>
        <Swiper
          slidesPerView={"auto"}
          spaceBetween={10}
          navigation={true}
          loop={true}
          centeredSlides={true}
          modules={[Navigation]}
          style={styles.swiper}
        >
          {images.map((img, i) => (
            <SwiperSlide
              key={i}
              style={styles.swiperSlide}
              onClick={() => openModal(i)}
            >
              <img
                src={img}
                alt={`Фото ${product.name} ${i}`}
                style={{
                  ...styles.image,
                  border:
                    i === activeIndex
                      ? "2px solid #555"
                      : "2px solid transparent",
                  cursor: "zoom-in",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Модалка */}
      {isOpen && (
  <div style={styles.modalOverlay} onClick={closeModal}>
    <span style={styles.closeButton} onClick={closeModal}>
      ×
    </span>

    <Swiper
      modules={[]}
      initialSlide={activeIndex}
      loop={true}
      onSwiper={(swiper) => {
        modalSwiperRef.current = swiper;
      }}
      onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      style={{
        maxWidth: "90vw",
        maxHeight: "90vh",
        width: "auto",
        height: "auto",
        position: "relative",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {images.map((img, i) => (
        <SwiperSlide
          key={i}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <TransformWrapper
            wheel={{ step: 0.1 }}
            pinch={{ step: 5 }}
            doubleClick={{ disabled: true }}
            minScale={1}
            limitToBounds={true}
            centerOnInit={true}
            zoomAnimation={{ animationTime: 200 }}
          >
            <TransformComponent>
              <img
                src={img}
                alt={`Фото ${product.name} повний екран ${i}`}
                style={styles.modalImage}
                onClick={(e) => e.stopPropagation()}
              />
            </TransformComponent>
          </TransformWrapper>
        </SwiperSlide>
      ))}

      {/* Власні кнопки навігації */}
      <button
        style={{ ...styles.modalNavButton, left: 0 }}
        onClick={(e) => {
          e.stopPropagation();
          modalSwiperRef.current?.slidePrev();
        }}
        aria-label="Попередній слайд"
      >
        ‹
      </button>
      <button
        style={{ ...styles.modalNavButton, right: 0 }}
        onClick={(e) => {
          e.stopPropagation();
          modalSwiperRef.current?.slideNext();
        }}
        aria-label="Наступний слайд"
      >
        ›
      </button>
    </Swiper>
  </div>
)}

    </>
  );
}

const styles = {
  galleryContainer: {
    padding: "10px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  swiper: {
    width: "100%",
    maxWidth: "450px",
    margin: "0 auto 10px",
  },
  swiperSlide: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "auto",
  },
  image: {
    width: "auto",
    height: "450px",
    maxHeight: "70vh",
    borderRadius: "10px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.9)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modalImage: {
    maxWidth: "140vw",
    maxHeight: "140vh",
    objectFit: "contain",
    borderRadius: "8px",
    userSelect: "none",
    pointerEvents: "auto",
  },
  closeButton: {
    position: "fixed",
    top: "20px",
    right: "30px",
    fontSize: "40px",
    color: "#fff",
    cursor: "pointer",
    zIndex: 1001,
    userSelect: "none",
  },
    modalNavButton: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "50px",
    cursor: "pointer",
    padding: "0 10px",
    zIndex: 1002,
    userSelect: "none",
    boxShadow: "none",
  },
  modalPrevButton: {
    left: 0,
  },
  modalNextButton: {
    right: 0,
  },
};
