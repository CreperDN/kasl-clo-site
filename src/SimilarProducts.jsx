import { Swiper, SwiperSlide } from "swiper/react";
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
  "fc5a50": "корал", "050d4f": "темно-синій"
};

export default function SimilarProducts({ data }) {
  if (data.length === 0) return null; 

  return (
    <div style={{ position: "relative", top: "-13px", padding: "0 10px", overflow: "hidden"}}>
      <small style={{ display: "block" }}>Інші Кольори</small>
      <Swiper
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
            <a href={`/product/${photo.slug}`} style={{ textAlign: "center", display: "block" }}>
              <img
                src={photo.url}
                alt={`Фото ${photo.name}`}
                onError={(e) => { e.target.src = "/placeholder.png"; }}
                style={{ width: "100%", maxHeight: "140px", minHeight:"12   0px", objectFit: "contain" }}
              />
              <label style={{ fontSize: "14px", marginTop: "5px", display: "block" }}>
                {colorsByValue[photo.colorValue]}
              </label>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
