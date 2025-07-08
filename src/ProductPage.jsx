import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import PhotoGallery from './PhotoSwiper';
import "swiper/css";

const TRANSLATE = {
    "Бицепс ½": "Біцепс ½",
    "Высота каблука": "Висота підбора",
    "Высота сапога": "Висота чобота",
    "Высота среднего шва": "Висота середнього шва",
    "Длина внешнего шва": "Довжина зовнішнього шва",
    "Длина внутреннего шва": "Довжина внутрішнього шва",
    "Длина до бедра": "Довжина до стегна",
    "Длина изделия": "Довжина виробу",
    "Длина изделия (жакет)": "Довжина виробу (жакет)",
    "Длина изделия (от плеча до талии)": "Довжина виробу (від плеча до талії)",
    "Длина изделия (сарафан)": "Довжина виробу (сарафан)",
    "Длина изделия (юбка)": "Довжина виробу (спідниця)",
    "Длина пояса (аксессуар)": "Довжина поясу (аксесуар)",
    "Длина рукава": "Довжина рукава",
    "Длина рукава (жакет)": "Довжина рукава (жакет)",
    "Длина стельки": "Довжина устілки",
    "Обхват головы": "Обхват голови",
    "Полуобхват бёдер": "Напівобхват стегон",
    "Полуобхват бёдер (брюки)": "Напівобхват стегон (брюки)",
    "Полуобхват бёдер (жакет)": "Напівобхват стегон (жакет)",
    "Полуобхват бёдер (сарафан)": "Напівобхват стегон (сарафан)",
    "Полуобхват бёдер (юбка)": "Напівобхват стегон (спідниця)",
    "Полуобхват голени": "Напівобхват гомілки",
    "Полуобхват груди": "Напівобхват грудей",
    "Полуобхват груди (жакет)": "Напівобхват грудей (жакет)",
    "Полуобхват груди (сарафан)": "Напівобхват грудей (сарафан)",
    "Полуобхват талии": "Напівобхват талії",
    "Полуобхват талии (брюки)": "Напівобхват талії (брюки)",
    "Полуобхват талии (жакет)": "Напівобхват талії (жакет)",
    "Полуобхват талии (сарафан)": "Напівобхват талії (сарафан)",
    "Полуобхват талии (юбка)": "Напівобхват талії (спідниця)",
    "Посадка спереди/сзади": "Посадка спереду/ззаду",
    "Разлет плечевой": "Розліт плечовий",
    "Разлет плечевой (жакет)": "Розліт плечовий (жакет)",
    "Ширина спинки": "Ширина спинки",
    "Ширина стельки": "Ширина устілки",
    "Ширина штанины (внизу)": "Ширина штанини (внизу)",
    "Ширина штанины (по бедру)": "Ширина штанини (по стегну)",
    "Ширина пояса": "Ширина пояса",
    "Длина изделия (от плеча до отрезной линии)": "Довжина виробу (від плеча до відрізної лінії)",
    "size": "Розмір"
}

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState([]);
  const priceIncrease = 300;

  // --- Основний запит на товар ---
  async function fetchProduct(slug) {
    const response = await fetch("https://modniy-ostrov.com/api/product_by_slug", {
      method: "POST",
      headers: {
        "accept": "application/json, text/plain, */*",
        "content-type": "application/json",
      },
      body: JSON.stringify({ slug, siteVersion: "ua_UA" }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    setInfo(data?.hits?.hits?.[0]?._source.taxons.forEach(e => e.slug))
    console.log(data?.hits?.hits?.[0]?._source)
    console.log(data?.hits?.hits?.[0]?._source.taxons)
    console.log(data?.hits?.hits?.[0]?._source.taxons.map(e => (e.taxonomy?.trans?.ua.name??e.taxonomy?.name) + ':' + (e.trans?.ua?.name??e.name)))
    console.log(data?.hits?.hits?.[0]?._source.attachedProducts[0]?.trans.ua.description) // Інші кольори
    console.log(data?.hits?.hits?.[0]?._source.activeSingleSizes)
    console.log(data?.hits?.hits?.[0]?._source.variants.map(e => e.dimensions))
    let measures = [];
    data?.hits?.hits?.[0]?._source.variants.map(e => e.dimensions.map(ee => measures.push(TRANSLATE[ee.measure.name]+':'+ee.value)))
    console.log(measures);

    console.log(data?.hits?.hits?.[0]?._source.variants.map(e => e.options[0].sizeDescription))
    console.log(data?.hits?.hits?.[0]?._source.attribures)
    // console.log(data?.hits?.hits?.[0]?._source.trans.ua.name)
    const source = data?.hits?.hits?.find(hit => hit._source?.slug === slug)?._source;

    if (!source) return null;

    const images = (source.images || []).map(img => img.dressaPath).slice(1);

    return {
      id: source.id,
      url: `https://cdn.modniy-ostrov.com/ostrov-cache/sylius_medium/${source.image?.dressaPath}`,
      price: source.priceUAH,
      name: source.correctedName,
      slug: source.slug,
      images,
      oldPrice: source.oldPriceUAH,
      similarParams: extractSimilarParams(source)
    };
  }

  // --- Формування параметрів для запиту схожих товарів ---
  function extractSimilarParams(source) {
    const category = source.mainCategory?.slug || "";
    const tsvet = source.taxons.find(t => t.taxonomy?.frontendFilterConstantName === "tsvet")?.slug || "";
    const season = source.taxons.find(t => t.taxonomy?.frontendFilterConstantName === "sezon")?.slug || "";
    const fason = source.taxons.find(t => t.taxonomy?.frontendFilterConstantName === "fason")?.slug || "";
    const dlina = source.taxons.find(t => t.taxonomy?.frontendFilterConstantName === "dlina")?.slug || "";

    return {
      id: source.id,
      category,
      slug: source.slug,
      tsvet,
      season,
      fason,
      dlina,
    };
  }

  // --- Запит схожих товарів ---
  async function fetchSimilarProducts(params) {
    const response = await fetch("https://modniy-ostrov.com/api/similar_products", {
      method: "POST",
      headers: {
        "accept": "application/json, text/plain, */*",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        params,
        page: 1,
        perPage: 10,
        siteVersion: "ua_UA",
        warehouse: "ua"
      })
    });

    if (!response.ok) return [];

    const data = await response.json();
    const hits = data?.hits?.hits || [];
    return hits.map(hit => {
      const src = hit._source;
      const images = (src.images || []).map(img => img.dressaPath).slice(1);
      return {
        name: src.correctedName,
        price: src.priceUAH,
        oldPrice: src.oldPriceUAH,
        slug: src.slug,
        images,
        url: `https://cdn.modniy-ostrov.com/ostrov-cache/sylius_medium/${src.image?.dressaPath}`,
      };
    });
  }

  // --- Початкове завантаження товару та схожих ---
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const prod = await fetchProduct(slug);
      if (!prod) {
        setProduct(null);
        setLoading(false);
        return;
      }
      setProduct(prod);
      const sim = await fetchSimilarProducts(prod.similarParams);
      setSimilar(sim);
      setLoading(false);
    };

    load();
  }, [slug]);

  if (loading) return <p>Завантаження...</p>;
  if (!product) return <p>Товар не знайдено</p>;

  const allImages = [product.url, ...product.images.map(img =>
    `https://cdn.modniy-ostrov.com/ostrov-cache/sylius_medium/${img}`
  )];
  const totalImages = allImages.length;

  if (totalImages === 0) return null;

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        ← Назад
      </button>
      {product && <PhotoGallery products={product} priceIncrease={300} />}
      <hr />
      <h3>Схожі товари:</h3>
      {similar.length > 0 && <PhotoGallery products={similar} priceIncrease={300} />}
      {info}
    </div>
  );
}

const styles = {
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
    width: "500px",
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