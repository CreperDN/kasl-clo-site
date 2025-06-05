import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css'
import PhotoGallery from './PhotoSwiper';
import "swiper/css";
import LZString, { compress } from 'lz-string';
import "swiper/css/navigation";

async function fetchFilters(mainCategory, category, sizes, colors) {
  let url = "";
  let cacheKey = "";

  if (mainCategory != null) {
    if (mainCategory === "novinki") {
      url = `https://api.modniy-ostrov.com.ua/api/v2/filters/${mainCategory}`;
      cacheKey = mainCategory;
    } else if (category == null) {
      url = `https://api.modniy-ostrov.com.ua/api/v2/filters/odiezhda/${mainCategory}`;
      cacheKey = `odiezhda/${mainCategory}`;
    } else if (category === "sportivnyi-stil"){
      url = `https://api.modniy-ostrov.com.ua/api/v2/filters/odiezhda/${category}`;
      cacheKey = `odiezhda/${category}`;
    } 
    else {
      url = `https://api.modniy-ostrov.com.ua/api/v2/filters/odiezhda/${mainCategory}/${category}`;
      cacheKey = `odiezhda/${mainCategory}/${category}`;
    }

    let params = [];
    if (sizes != []) {
      params.push('s=' + sizes.join('.'));
    }
    if (colors != []) {
       const colorValues = colors
          .map(color => COLORS[color])  
          .filter(Boolean); 

        if (colorValues.length === 1) {
          params.push('tsvet=' + String(colorValues[0]));
        } else if (colorValues.length > 1) {
          params.push('tsvet=' + colorValues.join("."));
        }
    }
    if (params.length > 0) {
      url = url + '?' + params.join('&');
    }
    console.log(params)
    cacheKey = cacheKey+ params.join("")

    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      console.log("👉 Взято з localStorage:", cacheKey);
      return JSON.parse(LZString.decompress(cached));
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          "accept": "application/json"
        }
      });

      if (response.ok) {
        const jsonData = await response.json();
        const compressed = LZString.compress(JSON.stringify(jsonData));
        localStorage.setItem(cacheKey, compressed);
        return jsonData;
      } else {
        console.error(`HTTP error! status: ${response.status}`);
      }
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.warn('⛔ localStorage переповнений, очищаю...');
        localStorage.clear(); // або очисти частково
        // можеш знову спробувати записати:
        localStorage.setItem(cacheKey, compressed);
      }
    }
  }

  return {};
}
async function fetchPhotos(category = 'novinki', size = [], tsvet = [], page = 1) {
 const url = "https://modniy-ostrov.com/api/product_by_categories_slugs";

  const headers = {
    "accept": "application/json, text/plain, */*",
    "content-type": "application/json",
  };

  const filters = {};

  // ✅ Перетворення розмірів на рядки
  const sizeValues = size.map(s => typeof s === 'object' && s.taxon ? s.taxon : s);
  if (sizeValues.length === 1) {
    filters.s = String(sizeValues[0]);
  } else if (sizeValues.length > 1) {
    filters.s = sizeValues.map(String).join("-or-");
  }

  // ✅ Перетворення кольорів на slug
  const colorValues = tsvet
    .map(color => COLORS[color])  // Замість color.taxon.trans.ua.name
    .filter(Boolean); // відкинути undefined

  if (colorValues.length === 1) {
    filters.tsvet = String(colorValues[0]);
  } else if (colorValues.length > 1) {
    filters.tsvet = colorValues.join("-or-");
  }

  // ✅ Перевірка на масив slug
  category = category.includes("/") ? category.split("/")[1] : category;
  let slugArray = Array.isArray(category) ? category : [category];

  // Спеціальний випадок для "plat-ia"
  if (slugArray.length === 1 && slugArray[0] === "plat-ia") {
    slugArray = ["plat-ia-2"];
  }

  const payload = {
    slugs: slugArray,
    filters: filters,
    page: page,
    perPage: 24,
    currentCurrenciesCode: "UAH",
    warehouse: "ua",
    siteVersion: "ua_UA",
  };

  console.log("📦 POST payload:", payload);

  // 🧠 Створюємо унікальний ключ для кешу
  const cacheKey = `photos_${slugArray.join(',')}_s=${filters.s || ''}_t=${filters.tsvet || ''}_p=${page}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      console.log("📦 Взято з localStorage:", cacheKey);
      return parsed;
    } catch (e) {
      console.warn("⚠️ Не вдалося прочитати кеш:", cacheKey);
    }
  }

  // 🛰️ Якщо немає в кеші — робимо запит
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      // localStorage.setItem(cacheKey, JSON.stringify(data)); // ✅ Зберігаємо у localStorage
      return data;
    } else {
      console.error("❌ Помилка статусу:", response.status);
    }
  } catch (error) {
    console.error("❌ Fetch error:", error);
  }

  return [];
}


function extractDressaPaths(data) {
  const result = [];
  const hits = data?.hits?.hits || [];
  hits.forEach((item) => {
    const path = item?._source?.image?.dressaPath;
    const images = [];
    item?._source?.images?.forEach((image) => {images.push(image.dressaPath || []);})
    images.shift();
    const name = item?._source?.correctedName;
    const slug = item?._source?.slug;
    const price = item?._source?.priceUAH;
    const oldPrice = item?._source?.oldPriceUAH;
    if (path) {
      result.push({
        "url":`https://cdn.modniy-ostrov.com/ostrov-cache/sylius_medium/${path}`, 
        "price":price,
        "name":name,
        "slug":slug,
        "images":images,
        "oldPrice":oldPrice,
      });
    }
  });
  localStorage[""]=result;
  return result;
}



const MAIN_CATEGORIES = {
  "Новинки": ["novinki"],
  "Сукні": ["plat-ia"],
  "Жіночі костюми": ["zhienskaia-povsiednievnaia-odiezhda/zhienskiie-kostiumy"],
  "Повсякденний одяг":["zhienskaia-povsiednievnaia-odiezhda"],
  "Хіт продажу": ["khit-prodazh"],
  "В'язаний одяг": ["viazanaia-odiezhda"],
  "Верхній одяг": ["vierkhniaia-odiezhda"],
  "Plus Size": ["bol-shiie-razmiery"],
};
const CLOTHING_CATEGORIES = {
  "Хіт продажу": {
    "Хіти суконь": ["khity-plat-iev"],
    "Хіти костюмів": ["khity-kostiumov"],
    "Хіти спідниць": ["khity-iubok"],
    "Хіти штанів": ["khity-briuk"],
    "В'язані хіти": ["viazanyie-khity"],
    "Трикотажні хіти": ["trikotazhnyie-khity"],
    "Хіти блузок": ["khity-bluzok"],
    "Хіти піджаків": ["khity-pidzhakov"],
  },
  "В'язаний одяг": {
    "Головні убори": ["shapka-zhienskaia"],
    "Кофти в'язані": ["kofty-viazanyie"],
    "Сукні та туніки": ["plat-ia-i-tuniki"],
    "В'язані кардигани та кофти": ["viazanyie-kardighany-i-kofty"],
    "Светри та в'язані джемпери": ["svitiery-i-viazanyie-dzhiempiery"],
    "Костюми в'язані": ["kostiumy-viazanyie"],
    "В'язані жилети": ["viazanyie-zhiliety"],
  },
  "Верхній одяг": {
    "Пальто і тренчі": ["pal-to-i-trienchi"],
    "Куртки і шуби": ["kurtki-i-shuby"],
    "Жилети та кардигани": ["zhiliety-i-kardighany"],
    "Бомбери та косухи": ["bombiery-i-kosukhi"],
  },
  "Plus Size": {
    "Сукні та сарафани": ["plat-ia-i-sarafany"],
    "Блузки": ["bluzki-plus-size"],
    "Трикотаж": ["trikotazh-plus-size"],
    "Штани та спідниці": ["briuki-i-iubki"],
    "Комплекти і комбінезони": ["kompliekty-i-kombiniezony"],
    "Светри та в'язані кардигани": ["svitiery-i-viazanyie-kardighany"],
    "Верхній одяг": ["vierkhniaia-odiezhda-plus-size"],
  },
  "Повсякденний одяг": {
    "Жіночі рубашки та блузки": ["zhienskiie-rubashki-i-bluzki"],
    "Спортивні костюми": ["sportivnyi-stil"],
    "Жіночі штани": ["zhienskiie-briuki"],
    "Спідниці": ["iubki"],
    "Жіночі піджаки, жакети": ["zhienskiie-pidzhaki-zhakiety"],
    "Жіночі світшоти": ["zhienskiie-svitshoty"],
    "Лосини": ["losiny"],
    "Жіночі футболки": ["zhienskiie-futbolki"],
    "Комбінезони": ["kombiniezony"],
    "Жіночі майки": ["zhienskiie-maiki"],
    "Жіночі шорти": ["zhienskiie-shorty"],
  },
};  
const COLORS = {
    "чорний":"chiernyi",
    "бежевий":"biezhievyi",
    "зелений":"zielienyi",
    "блакитний":"gholuboi",
    "білий":"bielyi",
    "синій":"sinii",
    "сірий":"sieryi",
    "рожевий":"rozovyi",
    "бордо":"bordo",
    "коричневий":"korichnievyi",
    "молочний":"molochnyi",
    "червоний":"krasnyi",
    "темно-синій":"tiemno-sinii",
    "бірюзовий":"biriuzovyi",
    "пудра":"pudra",
    "хакі":"khaki",
    "жовтий":"zhieltyi",
    "м'ятний":"miatnyi",
    "темно-зелений":"butylka",
    "бузковий":"sirienievyi",
    "фіолетовий":"fiolietovyi",
    "темно-сірий":"tiomno-sieryi",
    "теракотовий":"tierrakotovyi",
    "гірчичний":"ghorchichnyi",
    "помаранчевий":"oranzhievyi",
    "фуксія":"fuksiia",
    "корал":"korall",
    "персиковий":"piersikovyi",
    "графіт" : "ghrafit",
    "бордовий" : "bordovyi", 
    "молоко":"moloko"
}


export default function MainPage() {
  const [filters, setFilters] = useState(null);
  const [priceIncrease, setPriceIncrease] = useState(300);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('novinki');
  const [photosData, setPhotosData] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [page, setPage] = useState(1);
  const [isDataVisible, setDataVisibility] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const sentinelRef = useRef(null);
  const didRestoreFromCache = useRef(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isInitialMount = useRef(true);
  const [initialized, setInitialized] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [restoringCache, setRestoringCache] = useState(true); // ⬅️ флаг


useEffect(() => {
  const cached = localStorage.getItem("galleryCache");
  if (cached) {
    try {
      console.log("📦 Cached gallery found");
      const parsed = JSON.parse(LZString.decompress(cached));
      console.log(parsed);

      setSelectedMainCategory(parsed.selectedMainCategory ?? null);
      setSelectedCategory(parsed.selectedCategory ?? null);
      setSelectedSizes(parsed.selectedSizes ?? []);
      setSelectedColors(parsed.selectedColors ?? []);
      setPhotosData(parsed.photos ?? []);
      setFullData(parsed.fullData ?? []);
      setPage(parsed.page ?? 1);

      didRestoreFromCache.current = true; 

      setInitialized(true);
      setIsReady(true);
      setRestoringCache(false);
      return;
    } catch (e) {
      console.warn("Не вдалося розпакувати кеш", e);
    }
  }

  // Якщо немає кешу
  loadPhotos(1).then(() => {
    setInitialized(true);
    setIsReady(true);
    setRestoringCache(false);
  });
}, []);


useEffect(() => {
  if (!initialized) return;
  if (!didRestoreFromCache.current) {
    console.log("⛔ Пропускаємо запит: ще не відновлено з кешу");
    return;
  }
  console.log("right");
  setPage(1);
  setColors([]);
  setSizes([]);
  setPhotosData([]);
  setFullData([]);

  loadPhotos(1);
}, [selectedCategory, selectedMainCategory, selectedSizes, selectedColors]);



  useEffect(() => {
  if (!initialized) return;
    if (selectedMainCategory || selectedCategory) {
      loadData(selectedMainCategory, selectedCategory);
    }
  }, [selectedMainCategory, selectedCategory, selectedSizes, selectedColors]);

  const handleSizesCheckboxChange = (taxon) => {
    setSelectedSizes((prevSelected) =>
      prevSelected.includes(taxon)
        ? prevSelected.filter((item) => item !== taxon)
        : [...prevSelected, taxon]
    );
  };
   const handleColorsCheckboxChange = (taxon) => {
    setSelectedColors((prevSelected) =>
      prevSelected.includes(taxon)
        ? prevSelected.filter((item) => item !== taxon)
        : [...prevSelected, taxon]
    );
  };
  const handleMainCategoryRadioChange = (slug) => {
  setSelectedMainCategory(slug);
  setSelectedCategory(null);
  loadData(slug, null);
  setSelectedColors([]);
  setSelectedSizes([]);
};
  const handleCategoryRadioChange = (slug) => {
  setSelectedCategory(slug);
  loadData(selectedMainCategory, slug)
};

async function loadData(mainCategory, category) { 
  const data = await fetchFilters(mainCategory, category, selectedSizes, selectedColors);
  setFilters(data);
  setSizes(data?.data?.sizes ?? []);
  setColors(data?.data?.colors ?? []);
  setLoading(false);
};

const loadPhotos = async (page = 1) => {
  const data = await fetchPhotos(
    selectedCategory ?? selectedMainCategory,
    selectedSizes ?? [],
    selectedColors ?? [],
    page
  );
  setPhotosData(extractDressaPaths(data));
  setFullData(data);
};


const handleLoadMore = useCallback(async () => {
  setIsLoadingMore(true);
  const nextPage = page + 1;

  const data = await fetchPhotos(
    selectedCategory ?? selectedMainCategory,
    selectedSizes,
    selectedColors,
    nextPage
  );

  const newPhotos = extractDressaPaths(data);

  setPhotosData(prev => [...prev, ...newPhotos]);

  setFullData(prev => {
    const merged = { ...prev };
    merged.hits = {
      ...prev.hits,
      hits: [...(prev.hits?.hits || []), ...(data.hits?.hits || [])],
    };
    return merged;
  });

  setPage(nextPage);
  setIsLoadingMore(false);
}, [page, selectedCategory, selectedMainCategory, selectedSizes, selectedColors]);

useEffect(() => {
  if (!sentinelRef.current || isLoadingMore) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (
        entries[0].isIntersecting &&
        photosData.length < (fullData?.hits?.total || 0)
      ) {
        handleLoadMore();
      }
    },
    { rootMargin: '200px' }
  );

  observer.observe(sentinelRef.current);

  return () => observer.disconnect();
}, [photosData, fullData, handleLoadMore, isLoadingMore]);

  useEffect(() => {
    if (restoringCache) return; 
    const cache = { selectedMainCategory,selectedCategory,selectedSizes,selectedColors,photos: photosData,filters,fullData,page };
    localStorage.setItem("galleryCache", LZString.compress(JSON.stringify(cache)));
    console.log("gallery cache changed", cache)
  }, [ selectedMainCategory,selectedCategory,selectedSizes,selectedColors,photosData,filters,fullData,page ]);

    if (!isReady) {
    return <div>Завантаження...</div>;
    }

  return (
    <>
    <header style={styles.header}>
        <button onClick={() => setIsSidebarVisible(!isSidebarVisible)} style={styles.toggleButton}>
          {isSidebarVisible ? "Сховати фільтри" : "Показати фільтри"}
        </button>
        <div style={styles.logo}><img src={"/logo.png"} width={"80px"} ></img></div>
      </header>
      {isSidebarVisible && (
      <aside style={{...styles.sidebar, transform: isSidebarVisible ? 'translateX(0)' : 'translateX(-100%)',}} className={isSidebarVisible ? "show" : ""}>
      <button onClick={() => setIsSidebarVisible(false)} style={styles.closeButton}>✖</button>
      <div className="card">
        <div className="filter-section">
              <h3>Основні категорії</h3>
              {Object.entries(MAIN_CATEGORIES).map(([name, [slug]]) => (
                <label key={slug} style={{ display: "block" }}>
                  <input
                    type="radio"
                    name="main-category"
                    value={slug}
                    checked={selectedMainCategory === slug}
                    onChange={() => handleMainCategoryRadioChange(slug)}
                  />
                  {` ${name}`}
                </label>
              ))}
            </div>
            <div className="filter-section">
              <h3>Підкатегорії</h3>
              {Object.entries(CLOTHING_CATEGORIES).map(([type, categories]) => (
                (Object.keys(MAIN_CATEGORIES).find(key => MAIN_CATEGORIES[key][0] === selectedMainCategory) === type ? (
                <div key={type} style={{ marginBottom: "1rem" }}>
                  <strong>{type}</strong>
                    {Object.entries(categories).map(([name, [slug]]) => (
                      <label key={slug} style={{ display: "block" }}>
                        <input
                          type="radio"
                          name="sub-category"
                          value={slug}
                          checked={selectedCategory === slug}
                          onChange={() => handleCategoryRadioChange(slug)}
                        />
                        {` ${name}`}
                      </label>
                    ))} 
                </div>):(<React.Fragment key={type} />))
              ))}
            </div>
        {loading ? (
          <p>Завантаження фільтрів...</p>
        ) : (
          <div>
            <h2>Фільтри:</h2>
            <div><h3>Розмір</h3>
            {sizes.map((size) => (
              <label key={size.taxon} style={{ display: 'block' }}>
                <input
                  type="checkbox"
                  value={size.taxon}
                  checked={selectedSizes.includes(size.taxon)}
                  onChange={() => handleSizesCheckboxChange(size.taxon)}
                />
                {` ${size.taxon} (${size.count})`}
              </label>
            ))}
            <h3>Колір</h3>
            {colors.map((color) => (
              <label key={color.taxon.slug} style={{ display: 'block' }}>
              <input
                  type="checkbox"
                  value={color.taxon.slug}
                  checked={selectedColors.includes(color.taxon.trans.ua.name)}
                  onChange={() => handleColorsCheckboxChange(color.taxon.trans.ua.name)}
                />
                <span style={{display: 'inline-block', backgroundColor:`#${color.taxon.colorValue}`, height:16, width:16, border: '2px solid #000'}}></span>
                {` ${color.taxon.trans.ua.name} (${color.count})`}
              </label>
            ))}
            </div>
            <div style={{ marginTop: '1rem' }}>
              <strong>Обрані розміри:</strong> {selectedSizes.join(', ') || 'Немає'}<br></br>
              <strong>Обрані кольори:</strong> {selectedColors.join(', ') || 'Немає'}<br></br>
              <strong>Обрана основна категорія:</strong> {selectedMainCategory || 'Не обрано'}<br></br>
              <strong>Обрана категорія:</strong> {selectedCategory || 'Не обрано'}
            </div>
          </div>
        )}
      </div>
    </aside>)}
      <main style={styles.mainContent}>
        <PhotoGallery photos={photosData} priceIncrease={priceIncrease} />;
          <div ref={sentinelRef} style={{ height: "1px" }}></div>
          {isLoadingMore && (
            <div style={{ textAlign: "center", margin: "10px" }}>
              <span>Завантаження...</span>
            </div>
          )}
            <input type="button" value={isDataVisible ? "Сховати дані" : "Показати дані"}
              onClick={() => setDataVisibility(!isDataVisible)}/>
            {isDataVisible && <pre>{JSON.stringify(fullData, null, 2)}</pre>}
        </main>
    </>
  );
}


const styles = {
header: {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#333",
  padding: "10px 20px",
  color: "#fff",
  position: "fixed",        // 🔧 фіксуємо
  top: 0,
  left: 0,
  zIndex: 1002,
  minHeight: "90px",
},

logo: {
  paddingRight:"20px",
  fontSize: "24px",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  overflow: "hidden",       
  maxWidth: "100px",        
  whiteSpace: "nowrap",
},
  toggleButton: {
    padding: "8px 16px",
    backgroundColor: "#888",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
    fontSize: "16px",
  },
sidebar: {
  position: 'fixed',
  top: '90px',
  paddingLeft: "10px",
  left: 0,
  width: '280px',
  height: 'calc(100vh - 50px)', 
  backgroundColor: '#282828',
  borderRight: '1px solid #ccc',
  overflowY: 'auto',
  zIndex: 1001,
  transform: 'translateX(-100%)',
  transition: 'transform 0.3s ease-in-out',
},
closeButton: {
  position: 'absolute',
  top: '10px',
  right: '10px',
  background: 'transparent',
  border: 'none',
  fontSize: '20px',
  cursor: 'pointer',
},
  mainContent: {
  flex: 1,
  padding: '10px',
  paddingTop: '90px', // або стільки, скільки висота хедера
  overflowX: 'hidden',
},
};

