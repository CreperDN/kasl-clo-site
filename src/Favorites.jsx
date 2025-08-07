import PhotoGallery from './PhotoSwiper';

const handleGoToProduct = () => {
    return;
};

export default function Favorites() {
    const favorites = localStorage.getItem("favorites")
    const priceIncrease = 300;  

    return(   
        favorites
        ? <PhotoGallery products={favorites} priceIncrease={priceIncrease} handleGoToProduct={handleGoToProduct}/>
        : <div>Уподобаних товарів не знайдено, додайте їх переглядаючи товари</div>
    )
}