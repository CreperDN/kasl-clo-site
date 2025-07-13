import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";
import './App.css'
import PhotoGallery from './PhotoSwiper';
import Filters from './Filters';
import LZString, { compress } from 'lz-string';

async function fetchFilters(mainCategory, category, filters) {
    console.log("fetchFilters", mainCategory, category, filters);

    let url = "";
    let cacheKey = "";
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

    for(const key in filters){
        if(filters[key].length > 0){
            params.push(`${key}=` + filters[key].join('.'));
        }
    }

    if (params.length > 0) {
      url = url + '?' + params.join('&');
      url = url + '&locale=ua'
    }
    else{
      url = url + '?locale=ua'
    }

    console.log(params)
    cacheKey = cacheKey + params.join("")

    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      console.log("Взято з localStorage:", cacheKey);
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
        localStorage.clear();
        localStorage.setItem(cacheKey, compressed);
    }
  }
  return {};
}
async function fetchPhotos(category, filters = {}, page = 1, perPage = 24) {
  const url = "https://modniy-ostrov.com/api/product_by_categories_slugs";

  const headers = {
    "accept": "application/json, text/plain, */*",
    "content-type": "application/json",
  };

  const parsedFilters = {};

  for (const key in filters) {
    let raw = filters[key];

    if (raw instanceof Set) raw = Array.from(raw);
    if (!Array.isArray(raw)) raw = [raw];

    if (raw.length === 0) continue;

    // Загальний випадок
    const stringValues = raw.map(String);
    parsedFilters[key] =
    stringValues.length === 1
        ? stringValues[0]
        : stringValues.join("-or-");
  }

  // Обробка категорій
  category = Array.isArray(category) ? category : [category];
  let slugArray = category;

  if (slugArray.length === 1 && slugArray[0] === "plat-ia") {
    slugArray = ["plat-ia-2"];
  }
  if (slugArray[0] === "zhienskaia-povsiednievnaia-odiezhda/zhienskiie-kostiumy"){
    slugArray = ["zhienskiie-kostiumy"];
  }

  const payload = {
    slugs: slugArray,
    filters: parsedFilters,
    page: page,
    perPage: perPage,
    currentCurrenciesCode: "UAH",
    warehouse: "ua",
    siteVersion: "ua_UA",
  };

  console.log("📦 POST payload:", payload);
  console.log("parsedFilters:",parsedFilters)

  // Унікальний cacheKey
  const filtersStr = Object.entries(parsedFilters)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  const cacheKey = `photos_${slugArray.join(",")}_${filtersStr}_p=${page}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      console.log("Взято з localStorage:", cacheKey);
      return parsed;
    } catch (e) {
      console.warn("⚠️ Не вдалося прочитати кеш:", cacheKey);
    }
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      // localStorage.setItem(cacheKey, JSON.stringify(data)); // можеш увімкнути
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
        const name = item?._source?.trans.ua.correctedName;
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
    //localStorage[""]=result;
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


    export default function MainPage() {
  let isFetching = false;
  const [filters, setFilters] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [priceIncrease, setPriceIncrease] = useState(300);
  const [perPage, setPerPage] = useState(24);
  const [loading, setLoading] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState("novinki");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [photosData, setPhotosData] = useState([]);
  const [fullData, setFullData] = useState({ hits: { hits: [] } });
  const [isDataVisible, setDataVisibility] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const sentinelRef = useRef(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const isFromScroll = useRef(false);
  const navigate = useNavigate();

  const updateSearchParams = () => {
    const params = {
      main: selectedMainCategory ?? "novinki",
      category: selectedCategory ?? "",
    };
    for (const key in selectedFilters) {
      let raw = selectedFilters[key];
      console.log("RAW for key", key, raw);

      if (raw instanceof Set) raw = Array.from(raw);
      if (!Array.isArray(raw)) raw = [raw];

      if (raw.length === 0) continue;

      const stringValues = raw.map(String);
      params[key] =
      stringValues.length === 1
          ? stringValues[0]
          : stringValues.join("-or-");
    }
    params["page"]=page;
    if(params !== searchParams){
      setSearchParams(params);
    }
  };

  const parseFiltersFromSearchParams = () => {
      const filters = {};
      for (const [key, value] of searchParams.entries()) {
        if (value && !["main", "category", "page"].includes(key)) {
          filters[key] = value.split("-or-");
        }
      }
      return filters;
  };

  async function loadFilters(mainCategory, category, filters) { 
    if (!loading){
      const data = await fetchFilters(mainCategory, category, filters);
      setFilters(data?.data);
      console.log("Filters", data.data)
      setLoading(false);
    }
  };
    
  const loadPhotos = async (main, category, page, filtersOverride = null) => {
    const data = await fetchPhotos(
      category ?? main,
      filtersOverride ?? selectedFilters,
      page
    );
    setPhotosData(extractDressaPaths(data));
    setFullData(data);
  };

  const handleMainCategoryRadioChange = (slug) => {
      setSelectedMainCategory(slug);
      setSelectedCategory(null);
      setSelectedFilters({})
      setPage(1);
      loadFilters(slug, null, {});
  };

  const handleCategoryRadioChange = (slug) => {
      setPage(1);
      setSelectedCategory(slug);
      loadFilters(selectedMainCategory, slug, selectedFilters)
  };

  useEffect(() => {
    if (isReady){
    updateSearchParams();
  }
  }, [selectedMainCategory, selectedCategory, selectedFilters, page, isReady]);

  useEffect(() => {
    localStorage.setItem('page', page);
  }, [page]);

  useEffect(() => {
    const fetchDataFromUrl = async () => {
      const main = searchParams.get("main") || "novinki";
      const category = searchParams.get("category") || null;
      const filters = parseFiltersFromSearchParams();
      setSelectedFilters(filters);
      const pageFromUrl = searchParams.get("page") || 1;

      setSelectedMainCategory(main);
      setSelectedCategory(category);

      console.log("Page is loading", category ?? main, filters, pageFromUrl, perPage)

        const data = await fetchPhotos(
          category ?? main,
          filters,
          pageFromUrl,
          perPage,
        );
        const newPhotos = extractDressaPaths(data);
        setPhotosData(newPhotos);
        setFullData(data);

      setPage(pageFromUrl);
      localStorage.setItem('page', `${pageFromUrl}`);
      setIsReady(true);
    };

    fetchDataFromUrl();
  }, []);

useEffect(() => {
    if (isReady){
    const savedPosition = sessionStorage.getItem("scrollPosition");
    if (savedPosition !== null) {
        setTimeout(() => {
        window.scrollTo(0, parseInt(savedPosition, 10));
        }, 100); 
        sessionStorage.removeItem("scrollPosition");
    }
    }
}, [isReady]);


  // 🖱 Інфініт скролінг
// const handleLoadMore = useCallback(async () => {
//   if(!isLoadingMore){
//   setIsLoadingMore(true);

//   const nextPage = parseInt(page) + 1;

//   const data = await fetchPhotos(
//     selectedCategory ?? selectedMainCategory,
//     selectedFilters,
//     nextPage
//   );

//   if (data.hits.hits.length != 0){

//   const newPhotos = extractDressaPaths(data);

//   setPhotosData(prev => [...prev, ...newPhotos]);
//   setFullData(prev => {
//     const merged = { ...prev };
//     merged.hits = {
//       ...prev.hits,
//       hits: [...(prev.hits?.hits || []), ...(data.hits?.hits || [])],
//     };
//     return merged;
//   });

//   isFromScroll.current = true;
//   setPage(nextPage);
//   localStorage.setItem('page', `${nextPage}`);
//   setIsLoadingMore(false);
//     }}}, [page]);

// useEffect(() => {
//   isFetching = false;

//   const handleScroll = () => {
//     if (
//       isFetching || // локальний захист
//       isLoadingMore ||
//       !isReady ||
//       photosData.length >= (fullData?.hits?.total || 0)
//     ) {
//       // console.log("useEffect returned :c\n[isLoadingMore, isReady, photosData, fullData?.hits?.total, handleLoadMore]", isFetching, isLoadingMore, !isReady, photosData.length >= (fullData?.hits?.total || 0));
//       return;
//     }

//     const scrollTop = window.scrollY;
//     const windowHeight = window.innerHeight;
//     const fullHeight = document.documentElement.scrollHeight;

//     if (scrollTop + windowHeight >= fullHeight - 300) {
//       isFetching = true; // заблокували повторний виклик
//       console.log("📦 Завантажуємо ще сторінку");
//       handleLoadMore().finally(() => {
//         isFetching = false;
//       });
//     }
//   };

//   window.addEventListener("scroll", handleScroll);
//   return () => window.removeEventListener("scroll", handleScroll);
// }, [isLoadingMore, isReady, photosData, fullData?.hits?.total, handleLoadMore]);


  useEffect(() => {
    if (isFetching){
      return;
    }

    if (isReady) {
      if (isFromScroll.current) {
        console.log("🔁 Пропущено запит із-за скролінгу");
        isFromScroll.current = false;
        return;
    }
      const main = searchParams.get("main") || "novinki";
      const category = searchParams.get("category") || null;
      const pageFromUrl = parseInt(searchParams.get("page") || "1");
      const filtersFromUrl = parseFiltersFromSearchParams();

      loadFilters(main, category, filtersFromUrl);
      console.log("[searchParams, isReady]", main, category, pageFromUrl, filtersFromUrl)
      loadPhotos(main, category, pageFromUrl, filtersFromUrl);
  }
  else{
      const main = searchParams.get("main") || "novinki";
      const category = searchParams.get("category") || null;
      const filtersFromUrl = parseFiltersFromSearchParams();
      loadFilters(main, category, filtersFromUrl);
  }
}, [searchParams]);


        if (!isReady) {
        return <div>Завантаження...</div>;
        }

    return (
        <>
        <header style={styles.header}>
            <button onClick={() => setIsSidebarVisible(!isSidebarVisible)} style={styles.toggleButton}>
            {isSidebarVisible ? "Сховати фільтри" : "Показати фільтри"}
            </button>

            <p>{photosData.length}</p>
            
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

                <div>
                <Filters filters = {filters} selectedFilters= {selectedFilters} setSelectedFilters={setSelectedFilters} setPage={setPage}></Filters>
                </div>
                
                <div style={{ marginTop: '1rem' }}>
                </div>
            </div>
            )}
        </div>
        </aside>)}
        <main style={styles.mainContent}>
            {photosData && <PhotoGallery products={photosData} priceIncrease={priceIncrease} />}
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page <= 1}
              style={{ padding: "8px 16px" }}
            >
              ← Назад
            </button>
            <span style={{ padding: "8px 16px" }}>Сторінка {page}</span>
            <button
              onClick={() => {
                const totalPages = Math.ceil((fullData?.hits?.total || 0) / perPage);
                if (page < totalPages) {
                  setPage(prev => prev + 1);
                }
              }}
              disabled={page >= Math.ceil((fullData?.hits?.total || 0) / perPage)}
              style={{ padding: "8px 16px" }}
            >
              Вперед →
            </button>
          </div>
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
    position: "fixed",        
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
    paddingTop: '90px', 
    overflowX: 'hidden',
    },
    };

