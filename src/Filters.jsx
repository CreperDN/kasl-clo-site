import React, { useState } from "react";

const filtersGroups = [
  "density", "details", "events", "fashions", "length", 
//   "materials", 
  "ms", "neckline", 
  "seasons",  "seasons-additional", "siluet", "sleeves", "styles", "traceries", "types",
];
const groupsTranslate = {
  "density":"Щільність", 
  "details":"Деталі", 
  "events":"Подія", 
  "fashions":"Фасон", 
  "length":"Довжина", 
  "materials":"Матеріал", 
  "ms":"Матеріал", 
  "neckline":"Виріз", 
  "seasons":"Сезон",  
  "seasons-additional":"Додаткові Сезони", 
  "siluet":"Силует", 
  "sleeves":"Рукав", 
  "styles":"Стиль", 
  "traceries":"Орнамент", 
  "types":"Тип",
};
const groupsConstantName = {
    "density":"", "details":"detali", "events":"sobytie", "fashions":"fason", "length":"dlina", "materials":"ms","ms":"ms", "neckline":"neckline", "colors":"tsviet",
  "seasons":"sezon",  "seasons-additional":"", "siluet":"", "sleeves":"rukav", "styles":"stil", "traceries":"pattern", "types":"tip",
}

export default function Filters({ filters, selectedFilters, setSelectedFilters, setPage}) {
  const [expandedGroups, setExpandedGroups] = useState(localStorage.getItem("expandedGroups")??{});

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }))
    localStorage.setItem("expandedGroups", (prev) => ({...prev,  [group]: !prev[group], }));
  };

  const handleCheckboxChange = (group, value) => {
    setPage(1);
    window.scrollTo(0, 0);
    const groupValues = new Set(selectedFilters[group] || []);
    if (groupValues.has(value)) {
      groupValues.delete(value);
    } else {
      groupValues.add(value);
    }
    setSelectedFilters({
      ...selectedFilters,
      [group]: [...groupValues],
    });
    console.log(groupValues);
  };

  const sizes = filters?.sizes;
  const colors = filters?.colors;

  return (
    <>

    <h3>Розмір</h3>
    {sizes?.map((size) => (
    <label key={size.taxon} style={{ display: 'block' }}>
        <input
        type="checkbox"
        value={size.taxon}
        checked={Boolean(selectedFilters["s"]?.includes?.(String(size.taxon)))}
        onChange={() => handleCheckboxChange("s",String(size.taxon))}
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
        checked={Boolean(selectedFilters["tsvet"]?.includes?.(color.taxon.slug))}
        onChange={() => handleCheckboxChange("tsvet",color.taxon.slug)}
        />
        <span style={{display: 'inline-block', backgroundColor:`#${color.taxon.colorValue}`, height:16, width:16, border: '2px solid #000'}}></span>
        {` ${color.taxon.trans.ua.name} (${color.count})`}
    </label>
    ))}

      {filtersGroups.map((filterGroup) => {
        const groupItems = filters[filterGroup];
        if (!groupItems || groupItems.length === 0) return null;

        const isExpanded = expandedGroups[filterGroup];

        return (
          <div key={filterGroup} style={{ marginBottom: "1em" }}>
            <button
              onClick={() => toggleGroup(filterGroup)}
              style={{
                fontWeight: "bold",
                cursor: "pointer",
                background: "none",
                border: "none",
                padding: 0,
                fontSize: "1em",
              }}
            >
              {isExpanded ? "▼" : "▶"} {groupsTranslate[filterGroup] ?? filterGroup}
            </button>

            {isExpanded && (
              <div style={{ marginLeft: "1em", marginTop: "0.5em" }}>
                {groupItems.map((filter) => (
                  <label key={filter.taxon.id} style={{ display: "block" }}>
                    <input
                      type="checkbox"
                      value={filter.taxon.trans.ua.name??""}
                      checked={Boolean(selectedFilters[groupsConstantName[filterGroup]]?.includes?.(filter.taxon.slug))}
                      onChange={() =>
                        handleCheckboxChange(groupsConstantName[filterGroup], filter.taxon.slug)
                      }
                    />
                    {` ${filter.taxon.trans.ua.name ?? "гудзики"} (${filter.count})`}
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}