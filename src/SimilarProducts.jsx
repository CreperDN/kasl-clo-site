import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect } from "react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const colorsByValue = {
  "175722": "темно-зелений", "000000": "чорний", "ebc591": "бежевий",
  "16ab2d": "зелений", "2a49e8": "синій", "16caf2": "блакитний",
  "ffffff": "білий", "c7c3c7": "сірий", "fc74cf": "рожевий",
  "4a2d04": "коричневий", "75061c": "бордо", "fffff0": "молочний",
  "02024d": "темно-синій", "78866b": "хакі", "10decd": "бірюзовий",
  "e81515": "червоний", "befadc": "м'ятний", "edb8ba": "пудра",
  "ffee36": "жовтий", "e848e8": "бузковий", "960fa8": "фіолетовий",
  "c45824": "теракотовий", "de3ade": "фуксія", "ff8800": "помаранчевий",
  "fc5a50": "корал", "050d4f": "темно-синій", "f59989": "персик"
};
const forDark = "#cececeff"
const forLight = "#000000"


export default function SimilarProducts({ data }) {
  if (data.length === 0) return null; 
  console.log(data)

  return (
    <div style={{ position: "relative", top: "-13px", padding: "0 10px", overflow: "hidden"}}>
      <small style={{ display: "block" }}>Інші Кольори</small>
      <Swiper
        onInit={(swiper) => {
          const prev = swiper.el.querySelector(".swiper-button-prev");
          const next = swiper.el.querySelector(".swiper-button-next");

          [prev, next].forEach((btn) => {
            if (btn) {
              btn.style.width = "60px";
              btn.style.height = "120%";
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
        modules={[Navigation]}
        navigation
        slidesPerView={2}
        centeredSlides={false}
        spaceBetween={20}
        breakpoints={{
          480: { slidesPerView: 3 },
          640: { slidesPerView: 4 },
          800: { slidesPerView: 5 },
          991: { slidesPerView: 4 },
        }}
        style={{ padding: "0 20px" }}
      >
        {data.map((photo, idx) => (
          <SwiperSlide key={photo.slug}>
  <a
    href={`/product/${photo.slug}`}
    style={{
      textAlign: "center",
      display: "block",
      position: "relative", // щоб позиціонувати галочку
    }}
  >
    <img
      src={
        photo.url.includes("null")
          ? "https://cdn.modniy-ostrov.com/ostrov-cache/sylius_medium/" +
            photo.images[0]
          : photo.url
      }
      alt={`Фото ${photo.name}`}
      onError={(e) => {
        e.target.src = "/placeholder.png";
      }}
      style={{
        width: "100%",
        maxHeight: "140px",
        minHeight: "120px",
        objectFit: "contain",
        outline: photo.selected ? "4px solid #"+photo.colorValue : "none",
      }}
    />

      {/* Маленька галочка у кутку */}
      {photo.selected && (
        <div
          style={{
            position: "absolute",
            top: "61%",
            right: "2px",
            backgroundColor: "rgba(195, 195, 195, 0.85)",
            borderRadius: "0%",
            width: "30px",
            height: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}

      <label
        style={{
          fontSize: "14px",
          marginTop: "5px",
          display: "block",
          color: "#" + photo.colorValue,
          textShadow: ["000000", "050d4f", "02024d"].includes(photo.colorValue)
            ? `2px 0 ${forDark}, -2px 0 ${forDark}, 0 2px ${forDark}, 0 -2px ${forDark}, 
              1px 1px ${forDark}, -1px -1px ${forDark}, 1px -1px ${forDark}, -1px 1px ${forDark}`
            : `2px 0 ${forLight}, -2px 0 ${forLight}, 0 2px ${forLight}, 0 -2px ${forLight}, 
              1px 1px ${forLight}, -1px -1px ${forLight}, 1px -1px ${forLight}, -1px 1px ${forLight}`,
        }}
      >
        {colorsByValue[photo.colorValue]}
      </label>
    </a>
  </SwiperSlide>

        ))}
      </Swiper>
    </div>
  );
}
