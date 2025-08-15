import PhotoGallery from './PhotoSwiper';
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./Favorites.css"

const handleGoToProduct = () => {
  return;
};

export default function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("favorites")) ?? [];
  });
  const [history, setHistory] = useState(() => {
    return JSON.parse(localStorage.getItem("history")) ?? [];
  }); 
  const priceIncrease = 300;  

  // refs для заголовків
  const favoritesRef = useRef(null);
  const historyRef = useRef(null);

  // стани для видимості галерей
  const [favoritesVisible, setFavoritesVisible] = useState(true);
  const [historyVisible, setHistoryVisible] = useState(true);

  useEffect(() => {
    const observerOptions = { threshold: 0.1 };

    const favoritesObserver = new IntersectionObserver((entries) => {
      setFavoritesVisible(entries[0].isIntersecting);
    }, observerOptions);

    const historyObserver = new IntersectionObserver((entries) => {
      setHistoryVisible(entries[0].isIntersecting);
    }, observerOptions);

    if (favoritesRef.current) favoritesObserver.observe(favoritesRef.current);
    if (historyRef.current) historyObserver.observe(historyRef.current);

    return () => {
      if (favoritesRef.current) favoritesObserver.unobserve(favoritesRef.current);
      if (historyRef.current) historyObserver.unobserve(historyRef.current);
    };
  }, []);

    useEffect(() => {
    document.body.style.overflow = "visible";
    document.getElementById("root").style.overflow = "visible";
    return () => { document.body.style.overflowX = "hidden"; document.getElementById("root").style.overflowX = "hidden"; }
  }, []);

  // функції для скролу
  const scrollToFavorites = () => {
    favoritesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToHistory = () => {
    historyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return(  
    <> 
      <button 
        style={{ position:"absolute",top:"10px", left:"20px", zIndex: 1000 }}
        onClick={() => navigate(sessionStorage.getItem("mainPageURL") ?? "/")}>
        ← На Головну
      </button>

      {/* кнопки для швидкого скролу */}
      {!favoritesVisible && favorites.length > 0 && (
        <button 
          style={{ position: "fixed", bottom: "20px", left: "5%", zIndex: 1000, opacity: "0.7" }}
          onClick={scrollToFavorites}>
          ↑Перейти до вподобаних
        </button>
      )}

      {!historyVisible && history.length > 0 && (
        <button 
          style={{ position: "fixed", bottom: "20px", left: "5%", zIndex: 1000, opacity: "0.7" }}
          onClick={scrollToHistory}>
          ↓Перейти до історії
        </button>
      )}

      <div style={{textAlign:"center", marginTop:"50px", overflowX: "visible"}}>
        <div ref={favoritesRef}>
          <h2 className='stickyH2' style={{position:"sticky", top: "0", zIndex:"1000"}}>Уподобані</h2>
          {favorites.length > 0
            ? <PhotoGallery products={favorites} priceIncrease={priceIncrease} handleGoToProduct={handleGoToProduct}/>
            : <div>Уподобаних товарів не знайдено, додайте їх <a href={"/"}>переглядаючи товари</a></div>
          }
        </div>
        <hr />
          <div ref={historyRef}>
          <h2 className='stickyH2'style={{position:"sticky", top: "0", zIndex:"1000"}}>Історія перегляду</h2>
          {history.length > 0
            ? <PhotoGallery products={history} priceIncrease={priceIncrease} handleGoToProduct={handleGoToProduct}/>
            : <div>Жодного товару не <a href={"/"}>переглянуто</a></div>
          }
        </div>
      </div>
    </>
  )
}
