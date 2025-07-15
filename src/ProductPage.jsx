import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import PhotoGallery from './PhotoSwiper';
import Loading from './Loading';
import "swiper/css";
import LargeImageGallery from './LargeImageGallery';

const thStyle = { border: "1px solid #ccc", padding: "8px", textAlign: "left" };
const tdStyle = { border: "1px solid #ccc", padding: "8px" };

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
  "size": "Розмір",
  "Состав": "Склад"
};

const styles = {
  responsiveRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "space-between",
  },
  block: {
    flex: "1 1 45%",
    minWidth: "300px",
  },
mainContainer: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "center",         
    gap: "20px",                      
    maxWidth: "1200px",              
    margin: "0 auto",                 
    padding: "0 10px",                
  },
  galleryWrapper: {
    flex: "1 1 40%",
    minWidth: "400px"
  },
  infoWrapper: {
    flex: "1 1 55%",
    minWidth: "280px",
    fontSize: "13px",
    fontFamily: "sans-serif"
  }
};



export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(localStorage.getItem("selectedSize")??null);
  const [difColored, setDifColored] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState([]);
  const [measures, setMeasures] = useState([]);
  const [dimensionTable, setDimensionTable] = useState([]);
  const [characteristics, setCharacteristics] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredCol, setHoveredCol] = useState(null);
  const priceIncrease = 300;

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

    const source = data?.hits?.hits?.find(hit => hit._source?.slug === slug)?._source;
    if (!source) return null;

    const images = (source.images || []).map(img => img.dressaPath).slice(1);

    console.log(source)
    console.log(source.taxons)
    console.log(source.taxons.map(e => (e.taxonomy?.trans?.ua.name??e.taxonomy?.name) + ':' + (e.trans?.ua?.name??e.name)))
    console.log(source.attachedProducts[0]?.trans.ua.description) // Інші кольори
    console.log(source.activeSingleSizes)
    console.log(source.variants.map(e => e.dimensions))
    let measures = [];
    source.variants.map(e => e.dimensions.map(ee => measures.push(TRANSLATE[ee.measure.name]+':'+ee.value)))
    console.log(measures);

    console.log(source.variants.map(e => e.options[0].sizeDescription))
    console.log(source.attribures)
    

    const allMeasures = [];
    source.variants?.forEach(v => {
      v.dimensions?.forEach(dim => {
        const name = TRANSLATE[dim.measure.name] || dim.measure.name;
        allMeasures.push(`${name}: ${dim.value}`);
      });
    });

    setMeasures(allMeasures);
    let difColored = source.attachedProducts.map(src => {
      const images = (src.images || []).map(img => img.dressaPath).slice(1);
      return {
        name: src.correctedName,
        price: src.priceUAH??src.masterVariant.prices[0].value,
        oldPrice: src.oldPriceUAH,
        slug: src.slug,
        images,
        url: `https://cdn.modniy-ostrov.com/ostrov-cache/sylius_medium/${src.image?.dressaPath}`,
      };
    });
    setDifColored(difColored)
    setCharacteristics(source.taxons)

    let i = 0;

    let dimensionTable = source.variants?.map(v => {
        const size = v.options[0].value;
        const row = {};
        const isInStock = v.inStock;
        v.dimensions?.forEach(dim => {
          const name = TRANSLATE[dim.measure.name] || dim.measure.name;
          row[name] = dim.value;
        });
        return { size, ...row, isInStock };
    });
    setDimensionTable(dimensionTable.sort((a, b) => parseInt(a.size) - parseInt(b.size)));

    return {
      id: source.id,
      url: `https://cdn.modniy-ostrov.com/ostrov-cache/sylius_medium/${source.image?.dressaPath}`,
      price: source.priceUAH,
      name: source.correctedName,
      slug: source.slug,
      images,
      oldPrice: source.oldPriceUAH,
      similarParams: extractSimilarParams(source),
      description: source.trans?.ua?.description,
    };
  }

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

  if (loading) return <p><Loading></Loading></p>;
  if (!product) return <p>Товар не знайдено</p>;

  const allImages = [product.url, ...product.images.map(img =>
    `https://cdn.modniy-ostrov.com/ostrov-cache/sylius_medium/${img}`
  )];

return (
  <div style={{ padding: "20px" }}>
    <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
      ← Назад
    </button>

    {/* Основний блок: фото + опис */}
    <div style={styles.mainContainer}>
      {/* Галерея — ліва частина */}
      <div style={styles.galleryWrapper}>
        {product && <LargeImageGallery product={product} />}

        {selectedSize && (
          <div style={{ marginTop: "10px", color: "green", fontSize: "14px" }}>
            Обрано розмір: <strong>{selectedSize}</strong>
          </div>
        )}
        <a
          href={`https://www.instagram.com/direct/t/17844611783624416`}
          target="_blank"
          rel="noopener noreferrer"
          className="order-button"
          onClick={()=>{
            navigator.clipboard.writeText(`Замовлення: ${product.name}, ${selectedSize ? "Обраний розмір:"+selectedSize+"," : ""} Посилання: https://kasl-clo.onrender.com/product/${product.slug}`);
        }}
        >
          Замовити в Direct
        </a>
      </div>

      {/* Інфо — права частина */}
      <div style={styles.infoWrapper}>
        {/* Таблиця розмірів */}
        {dimensionTable.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Таблиця розмірів:</h3>
          <div style={{ overflowX: "auto", textAlign: "center" }}>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Розмір</th>
                  {Array.from(new Set(dimensionTable.flatMap(Object.keys)))
                    .filter(key => !["size", "isInStock"].includes(key))
                    .map((key, colIndex) => (
                      <th
                        key={colIndex}
                        className={`${hoveredCol === colIndex || hoveredCol === -1 ? "hover-cell" : ""}`}
                      >
                        {key}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {dimensionTable.map((row, rowIndex) =>
                  Object.keys(row).length > 2 ? (
                    <tr
                      key={rowIndex}
                      className={`${hoveredRow === rowIndex || hoveredCol === -1 ? "hover-cell" : ""}`}
                    >
                      <td
                        className={`${hoveredRow === rowIndex || hoveredCol === -1 ? "hover-cell" : ""}`}
                        onMouseEnter={() => {
                          setHoveredRow(rowIndex);
                          setHoveredCol(-1);
                        }}
                        onMouseLeave={() => {
                          setHoveredRow(null);
                          setHoveredCol(null);
                        }}
                      >
                          <button
                            onClick={() => {
                              if (row.isInStock) setSelectedSize(row.size);
                              localStorage.setItem("selectedSize", row.size);
                            }}
                            disabled={!row.isInStock}
                            style={{
                              cursor: row.isInStock ? "pointer" : "not-allowed",
                              opacity: row.isInStock ? 1 : 0.5,
                            }}
                            title={!row.isInStock ? "Розміру нема в наявності" : ""}
                          >
                            {row.size}
                          </button>
                        </td>

                      {Array.from(new Set(dimensionTable.flatMap(Object.keys)))
                        .filter(key => !["size", "isInStock"].includes(key))
                        .map((key, colIndex) => (
                          <td
                            key={colIndex}
                            className={`${hoveredRow === rowIndex || hoveredCol === colIndex ? "hover-cell" : ""}`}
                            onMouseEnter={() => {
                              setHoveredRow(rowIndex);
                              setHoveredCol(colIndex);
                            }}
                            onMouseLeave={() => {
                              setHoveredRow(null);
                              setHoveredCol(null);
                            }}
                          >
                            {row[key] ?? "-"}
                          </td>
                        ))}
                    </tr>
                  ) : null
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

        <div style={styles.responsiveRow}>
          {/* Опис товару */}
          {product.description && (
            <div style={styles.block}>
              <h3>Опис товару:</h3>
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
          )}

          {/* Характеристика */}
          {characteristics.length > 0 && (
            <div style={{ ...styles.block, marginTop: product.description ? 0 : "20px" }}>
              <h3>Характеристика:</h3>
              <ul>
                {characteristics.map((m, i) =>
                  (!["Материал.сайт", undefined, "Одежда", "Фотомодель", "Метка на сайте"].includes(m.taxonomy?.trans?.ua?.name ?? m.taxonomy?.name)) && (
                    <li key={i}>
                      {(m.taxonomy?.trans?.ua.name ?? TRANSLATE[m.taxonomy?.name] ?? m.taxonomy?.name) + ": " + (m.trans?.ua?.name ?? m.name)}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Інші товари */}
    <hr />
    {difColored.length > 0 && <div><h3>Інші кольори:</h3>
    <PhotoGallery products={difColored} priceIncrease={300} /></div>}
    <h3>Схожі товари:</h3>
    {similar.length > 0 && <PhotoGallery products={similar} priceIncrease={300} />}
  </div>
);
}
