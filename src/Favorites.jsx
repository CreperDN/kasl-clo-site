import PhotoGallery from './PhotoSwiper';
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

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

    return(  
      <> 
        <button style={{ position:"fixed",top:"10px", left:"20px" }}
        onClick={() => navigate(sessionStorage.getItem("mainPageURL")??"/")}>
          ← На Головну
        </button>
        <div style={{textAlign:"center", marginTop:"50px"}}>
          <h2>Уподобані</h2>
          {favorites.length > 0
          ? <PhotoGallery products={favorites} priceIncrease={priceIncrease} handleGoToProduct={handleGoToProduct}/>
          : <div>Уподобаних товарів не знайдено, додайте їх <a href={"/"}>переглядаючи товари</a></div>}
          <hr />
          <h2>Історія перегляду</h2>
          {history.length > 0
          ? <PhotoGallery products={history} priceIncrease={priceIncrease} handleGoToProduct={handleGoToProduct}/>
          : <div>Жодного товару не <a href={"/"}>переглянуто</a></div>}
        </div>
      </>
    )
}