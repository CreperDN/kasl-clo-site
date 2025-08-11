import React, { useEffect, useState } from "react";

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
  if (!filters || Object.keys(filters).length === 0) {
    return null;
  }
  const [expandedGroups, setExpandedGroups] = useState(JSON.parse(sessionStorage.getItem("expandedGroups"))??{});
  console.log("FILTERS!!!!!", filters)

  let col = new Object;
  filters.colors.map(filter => col[filter.taxon.colorValue]=filter.taxon.trans.ua.name)

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }))
  };

  useEffect(()=>{
    sessionStorage.setItem("expandedGroups", JSON.stringify(expandedGroups));
  },[expandedGroups])

  useEffect(()=>{
    localStorage.setItem("selectedSize", selectedFilters["s"]);
  },[selectedFilters["s"]])

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

    <div key={"Size"} style={{ marginBottom: "1em" }}>
    <button
        onClick={() => toggleGroup("Розмір")}
        style={{
          fontWeight: "bold",
          cursor: "pointer",
          background: "none",
          border: "none",
          padding: 0,
          fontSize: "1em",
        }}
      >
        {expandedGroups["Розмір"] ? "▼" : "▶"} Розмір
      </button>
    {expandedGroups["Розмір"] && <div style={{ marginLeft: "1em", marginTop: "0.5em" }}>{(sizes?.map((size) => (
    <label key={size.taxon} style={{ display: 'block' }}>
        <input
        type="checkbox"
        value={size.taxon}
        checked={Boolean(selectedFilters["s"]?.includes?.(String(size.taxon)))}
        onChange={() => {handleCheckboxChange("s",String(size.taxon))}}
        />
        {` ${size.taxon} (${size.count})`}
    </label>
    )))}</div>}
    </div>

    <div key={"Color"} style={{ marginBottom: "1em" }}>
    <button
        onClick={() => toggleGroup("Колір")}
        style={{
          fontWeight: "bold",
          cursor: "pointer",
          background: "none",
          border: "none",
          padding: 0,
          fontSize: "1em",
        }}
      >
        {expandedGroups["Колір"] ? "▼" : "▶"} Колір
      </button>
      
    {expandedGroups["Колір"] && <div style={{ marginLeft: "1em", marginTop: "0.5em" }}>{(colors.map((color) => (
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
    )))}</div>}
    </div>

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