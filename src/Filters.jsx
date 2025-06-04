import React, { useState } from "react";

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

export default function Filters({}) { 
    return(   
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
)
}