import PhotoGallery from './PhotoSwiper';
import { useState } from "react";

const handleGoToProduct = () => {
    return;
};

export default function Favorites() {
      const [favorites, setFavorites] = useState(() => {
        return JSON.parse(localStorage.getItem("favorites")) ?? [];
      });
          const [history, setHistory] = useState(() => {
        return JSON.parse(localStorage.getItem("history")) ?? [];
      });
    const priceIncrease = 300;  

    return(   
      <>
        {favorites
        ? <PhotoGallery products={favorites} priceIncrease={priceIncrease} handleGoToProduct={handleGoToProduct}/>
        : <div>Уподобаних товарів не знайдено, додайте їх переглядаючи товари</div>}
        <hr />
        {favorites
        ? <PhotoGallery products={history} priceIncrease={priceIncrease} handleGoToProduct={handleGoToProduct}/>
        : <div>Жодного товару не переглянуто</div>}
      </>
    )
}