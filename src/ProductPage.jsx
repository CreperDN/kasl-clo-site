import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import PhotoGallery from './PhotoSwiper';
import Loading from './Loading';
import "swiper/css";
import LargeImageGallery from './LargeImageGallery';
import SimilarProducts from "./SimilarProducts";

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
    // gap: "20px",
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
    gap: "0px",                                         
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
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [activeSingleSizes, setActiveSingleSizes] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredCol, setHoveredCol] = useState(null);
  const priceIncrease = 300;
  const [history, setHistory] = useState(() => {
    return JSON.parse(localStorage.getItem("history")) ?? [];
  });

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

    let images = (source.images || []).map(img => img.dressaPath).slice(1);
    if (images[0]==null){
      images=[source.image.path]
    }

    console.log(source)
    console.log(source.taxons)
    console.log(source.taxons.map(e => (e.taxonomy?.trans?.ua.name??e.taxonomy?.name) + ':' + (e.trans?.ua?.name??e.name)))
    console.log(source.attachedProducts[0]?.trans.ua.description) // Інші кольори

    const activeSingleSizes = source.activeSingleSizes
    console.log(activeSingleSizes)//Available sizes
    setActiveSingleSizes(activeSingleSizes)
    console.log(activeSingleSizes.filter(item => localStorage.getItem("selectedSize")?.includes(item)))
    setSelectedSize(activeSingleSizes.filter(item => localStorage.getItem("selectedSize")?.includes(item)));

    console.log(source.variants.map(e => e.dimensions))
    let measures = [];
    source.variants.map(e => e.dimensions.map(ee => measures.push(TRANSLATE[ee.measure.name]+':'+ee.value)))
    console.log(measures);

    console.log(source.variants.map(e => e.options[0].sizeDescription))
    console.log(source.attribures)
    console.log("ДЛЯ SIMILAR PRODUCTS!!!!",source.attachedProducts)
    console.log("ДЛЯ SIMILAR PRODUCTS!!!!",source.attachedProducts.map(o => console.log(o.taxons.find(oo => oo.colorValue !== null))))//HEX кольору
    

    const allMeasures = [];
    source.variants?.forEach(v => {
      v.dimensions?.forEach(dim => {
        const name = TRANSLATE[dim.measure.name] || dim.measure.name;
        allMeasures.push(`${name}: ${dim.value}`);
      });
    });

    setMeasures(allMeasures);
    let difColored = source.attachedProducts.map(src => {
      const images = (src.images).map(img => {return img.dressaPath ?? img.path}).slice(1);
      return {
        // name: src.correctedName, 
        // isDark:src.taxons.find(oo => oo.colorValue !== null).isDark,
        colorValue: src.taxons.find(oo => oo.colorValue !== null)?.colorValue??"ebc591", //(taxons.find(taxon => taxons.remalink.includes("tsviet"))).colorValue
        // price: src.priceUAH ?? src?.masterVariant?.prices[0]?.value,
        // oldPrice: src.oldPriceUAH,
        slug: src.slug,
        images,
        url: `https://cdn.modniy-ostrov.com/ostrov-cache/sylius_medium/${src.image.dressaPath}`,
        selected : false
      };
    });
    if (difColored.length !== 0){
      difColored = [...difColored, {"colorValue":source.taxons.find(taxon => taxon.permalink.includes("tsviet")).colorValue, "slug":source.slug, 
        "images":source.images, "url":`https://cdn.modniy-ostrov.com/ostrov-cache/sylius_medium/${source.image?.dressaPath}`, selected: true}]
      setDifColored(difColored)
    } else{
      setDifColored(difColored)
    }
    setCharacteristics(source.taxons)

    let i = 0;

    let dimensionTable = source.variants?.map(v => {
      const size = v.options?.[0]?.value;
      const row = {};
      const isInStock = v.inStock;
      console.log("size.split("-")",size.split("-"))
      const isActive = size.split("-").every(val => activeSingleSizes.includes(parseInt(val)))

      v.dimensions?.forEach(dim => {
        const name = TRANSLATE[dim.measure?.name] || dim.measure?.name;
        if (name) {
          row[name] = dim.value;
        }
      });

      if (size && Object.keys(row).length > 0) {
        return { size, ...row, isInStock, isActive };
      }

      return null;
    }).filter(Boolean); // прибрати null і undefined

    console.log(dimensionTable.find(e => e.size==selectedSize && e.isInStock))
    
    if (!dimensionTable.find(e => selectedSize?.includes(e.size) && e.isInStock)){setSelectedSize(null)}

    if(Array.from(new Set(dimensionTable.flatMap(Object.keys))).length < 3){
      dimensionTable = source.variants?.map(v =>
        {
          let sizeDescription = v.options[0].sizeDescription
          const isInStock = v.inStock;
          console.log("Object.keys(sizeDescription)[0].split("-")",Object.keys((sizeDescription))[0].split("-"))
          const isActive = Object.keys(sizeDescription)[0].split("-").every(val => activeSingleSizes.includes(parseInt(val)))
          return{sizeDescription, isInStock, isActive}
        }
      )
    }

    console.log(dimensionTable)
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
      setHistory((prevHistory) => {
        let updated;
        if (prevHistory.find((item) => item.slug == slug)) {
          return prevHistory;
        } else {
          updated = [...prevHistory, {"url":prod.url, "price":prod.price, "name":prod.name, "slug":prod.slug, "images":prod.images, "oldPrice":prod.oldPrice}];
          if (updated.length > 12){updated.shift()}
        }
        return updated;
      });
      const sim = await fetchSimilarProducts(prod.similarParams);
      setSimilar(sim);
      setLoading(false);
    };

    load();
  }, [slug]);

  useEffect(() => {
    if(history)
      localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  if (loading) return <Loading></Loading>;
  if (!product) return <p>Товар не знайдено</p>;

  const allImages = [product.url, ...product.images.map(img =>
    `https://cdn.modniy-ostrov.com/ostrov-cache/sylius_medium/${img}`
  )];

  const paramKeys = Array.from(
  new Set(dimensionTable.flatMap(obj => Object.keys(obj)))
  ).filter(key => !["size", "isInStock", "isActive"].includes(key));
  const transposedKeys = paramKeys.sort(); // Можна не сортувати, якщо важливий порядок


return (
  <div style={{ paddingTop:"10px", paddingRight: "20px", paddingLeft: "20px" }}>
    <button onClick={() => navigate(sessionStorage.getItem("mainPageURL")??"/")}>
      ← На Головну
    </button>
<div
  className="toggleButton"  style={{    width: "120px",    height: "40px",    borderRadius: "44px",
    position: "fixed",    left: "90%",    top: "90%",    display: "flex",    justifyContent: "center",     
    alignItems: "center",         
  }}
>
  <a
    href="https://www.instagram.com/kasl_clo/"
    style={{
      display: "flex",       alignItems: "center",        gap: "6px",                  
      color: "inherit",      textDecoration: "none",
    }}
    onClick={() => {
      navigator.clipboard.writeText(
        `Замовлення: ${product.name}, ${
          selectedSize ? "Обраний розмір:" + selectedSize.toString() + "," : ""
        } Ціна: ${(product.price / 100 + priceIncrease).toFixed(2)} грн, Посилання: https://kasl-clo.onrender.com/product/${product.slug}`
      );
    }}
  >
    <svg
      aria-label="Direct"      fill="currentColor"      height="24"
      role="img"      viewBox="0 0 24 24"      width="24"
    >
      <title>Direct</title>
      <line
        fill="none"        stroke="currentColor"        strokeLinejoin="round"
        strokeWidth="2"        x1="22"        x2="9.218"        y1="3"
        y2="10.083"
      ></line>
      <polygon
        fill="none"        points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
        stroke="currentColor"        strokeLinejoin="round"        strokeWidth="2"
      ></polygon>
    </svg>
    Direct
  </a>
</div>


    {/* Основний блок: фото + опис */}
    <div style={styles.mainContainer}>
      {/* Галерея — ліва частина */}
      <div style={styles.galleryWrapper}>
        {product && <LargeImageGallery product={product} />}
        {difColored && <SimilarProducts data={difColored}/>}

      </div>

      {/* Інфо — права частина */}
      <div style={styles.infoWrapper}>
        {/*Назва*/ }
        {product.name && <h3 style={{marginTop:0, marginBottom:"3px"}}>{product.name}</h3>}
        {/*Ціна*/ }
        <h6 style={{marginTop:0, marginBottom:"-7px", fontSize:"20px"}}>
        {product.oldPrice != null ? (
                <div key ={product.oldPrice} style={{ display: "flex", justifyContent: "left" }}>
                  <s style={{ color: "gray", marginRight: "8px" }}>
                    {(product.oldPrice / 100 + priceIncrease).toFixed(2)} грн
                  </s>
                  <strong>
                    {(product.price / 100 + priceIncrease).toFixed(2)} грн
                  </strong>
                </div>
              ) : (
                <div key ={product.oldPrice} style={{ display: "flex", justifyContent: "left" }}>
                  <strong style = {{}}>
                    {(product.price / 100 + priceIncrease).toFixed(2)} грн
                  </strong>
                </div>
              )}
          </h6>
          {/*Замовити в Дірект*/}
              <a
            href={`https://www.instagram.com/kasl_clo/`}
            target="_blank"
            rel="noopener noreferrer"
            className="order-button"
            onClick={()=>{
              navigator.clipboard.writeText(`Замовлення: ${product.name}, ${selectedSize ? "Обраний розмір:"+selectedSize.toString()+"," : ""} Ціна: ${(product.price / 100 + priceIncrease).toFixed(2)} грн, Посилання: https://kasl-clo.onrender.com/product/${product.slug}`);
          }}
          >
            Замовити в Direct 
          </a>

        {/* Список розмірів */}
        <div style={{display:"flex", flexWrap:"wrap"}}>
        {dimensionTable.map((row, i) => (
          <button
          style={{marginLeft:"2px" }}
          key = {Object.keys(row.sizeDescription ?? {})[0] ?? row.size+`${(i*2)}`}
            onClick={() => {
              if (row.isActive) setSelectedSize(Object.keys(row.sizeDescription ?? {})[0] ?? row.size);
            }}
            disabled={!row.isActive}
            title={!row.isActive ? "Розміру нема в наявності" : !row.isInStock ? "Готовність відправки до 5 робочих днів" : ""}
          >
            {Object.keys(row.sizeDescription ?? {})[0] ?? row.size}{(!row.isInStock && row.isActive) && <b>*</b>}
          </button>
          ))}
        {dimensionTable.some(row => row.isActive !== row.isInStock) && <div style={{alignSelf: "end"}}>* - Готовність відправки до 5 робочих днів</div>}
        </div>
        {/* Таблиця розмірів */}
        <u onClick={()=>setIsTableVisible(!isTableVisible)} style={{cursor:"pointer"}}>{isTableVisible?"Закрити таблицю розмірів":"Відкрити таблицю розмірів"}</u>

        {isTableVisible && (Array.from(new Set(dimensionTable.flatMap(Object.keys))).length > 3 ? (
        <div className="size-table-container">
        <div className="size-table-wrapper" style={{    overflowX: "auto",    boxSizing: "border-box",    maxWidth: "100%",  }}>
          <table className="size-table">
            <thead>
              <tr>
                <th className="param-name" style={{ position: "sticky", left: 0, zIndex: 2 }}>Розмір</th>
                {dimensionTable.map((row, i) => (
                  <th key={i} className={`size-header ${row.isInStock ? '' : 'out-of-stock'}`}>
                    <button
                      onClick={() => {
                        console.log(row.size);
                        if (row.isActive) setSelectedSize(row.size);
                      }}
                      disabled={!row.isActive}
                      title={!row.isActive ? "Розміру нема в наявності" : !row.isInStock ? "Готовність відправки до 5 робочих днів" : ""}
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",         
                        maxWidth: "100%",           
                      }}
                    >
                      {row.size}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transposedKeys.map((key, rowIdx) => (
                <tr key={rowIdx}>
                  <td className="param-name" style={{ position: "sticky", left: 0, zIndex: 2 }}>{key}</td>
                  {dimensionTable.map((row, colIdx) => (
                    <td key={colIdx} className="param-value">
                      {row[key] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      )
      :
      <div className="dimension-section">
  <h3>Розмірна сітка:</h3>
  <div className="table-scroll">
    <table className="transposed-table">
      <thead>
        <tr>
          <th>Розмір</th>
          {dimensionTable.map((row, i) => (
            <th key={i}>
              <button
                      onClick={() => {
                        if (row.isActive) setSelectedSize(Object.keys(row.sizeDescription)[0]);
                      }}
                      disabled={!row.isActive}
                      title={!row.isActive ? "Розміру нема в наявності" : !row.isInStock ? "Готовність відправки до 5 робочих днів" : ""}
                    >
                      {Object.keys(row.sizeDescription)[0]}
                    </button>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.values(dimensionTable[0].sizeDescription)[0].map((_, rowIndex) => (
          <tr key={rowIndex}>
            <td className="label">
              {
                ["Груди", "Талія", "Стегна"][rowIndex] ?? `Поле ${rowIndex + 1}`
              }
            </td>
            {dimensionTable.map((row, colIndex) => (
              <td key={colIndex}>
                {
                  Object.values(row.sizeDescription)[0][rowIndex] ?? "-"
                }
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
      )}
       {/*Обраний розмір*/}
        <div style={{  maxWidth: "100%",  padding: "0 16px",  boxSizing: "border-box", alignSelf: "flex-start"}}>
          {selectedSize && (
            <div style={{ marginTop: "10px", fontSize: "14px" }}>
              Обрано розмір: <strong>{selectedSize.toString()}</strong>
            </div>
          )}
        </div>

        <div style={styles.responsiveRow}>
          {/* Опис товару */}
          {product.description && (
            <div style={{...styles.block, fontSize: "15px"}}>
              <h3 style={{marginTop:"5px", marginBottom:"8px", fontSize:"20px"}}>Опис товару:</h3>
              <div dangerouslySetInnerHTML={{ __html: product.description }} style = {{fontSize: "15px"}}/>
            </div>
          )}

          {/* Характеристика */}
          {characteristics.length > 0 && (
            <div style={{ ...styles.block, marginTop: product.description ? 0 : "20px", fontSize: "15px" }}>
              <h3 style={{marginTop:"5px", marginBottom:"-4px", fontSize:"20px"}} >Характеристика:</h3>
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
    {/* {difColored.length > 0 && <div><h3>Інші кольори:</h3>
    <PhotoGallery products={difColored} priceIncrease={300} /></div>} */}
    <h3>Схожі товари:</h3>
    {similar.length > 0 && <PhotoGallery products={similar} priceIncrease={300} />}
  </div>
);
}
