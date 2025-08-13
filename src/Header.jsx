import { useState, useEffect } from "react";

export default function Header({
  isMobile,
  areCategoriesVisible,
  setCategoriesVisible,
  isSidebarVisible,
  setIsSidebarVisible,
  MAIN_CATEGORIES,
  CLOTHING_CATEGORIES,
  hoveredMain,
  setHoveredMain,
  selectedMainCategory,
  handleMainCategoryRadioChange,
  handleCategoryRadioChange,
  handleGoToProduct,
}) {
  const [showHeader, setShowHeader] = useState(true);

  const styles = {
    header: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
      position: "fixed",        
      top: 0,
      left: 0,
      zIndex: 1002,
      minHeight: "45px",
      right: 0,
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      transform: showHeader ? "translateY(0)" : "translateY(-100%)",
      transition: "transform 0.4s ease-in-out",
      padding: "10px 15px",
    },
    toggleButton: {
      padding: "5px 10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      // background: "#f7f7f7",
      cursor: "pointer",
    },
  };

  return (
    <header style={styles.header}>
      <button
        // className="toggleButton"
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        style={{ ...styles.toggleButton, marginTop: "0px" }}
      >
        {isSidebarVisible ? "Сховати фільтри" : "Показати фільтри"}
      </button>

      {isMobile ? (
        <div>
          <button
            // className="toggleButton"
            onClick={() => setCategoriesVisible(!areCategoriesVisible)}
            style={{ ...styles.toggleButton, margin: "5px", marginRight: "20px" }}
          >
            ☰
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            gap: "20px",
            fontSize: "13px",
            fontWeight: "bold",
            marginRight: "20px"
          }}
        >
          {Object.entries(MAIN_CATEGORIES).map(([name, [slug]]) => {
            return (
              <div
                key={slug}
                style={{ position: "relative" }}
                onMouseEnter={() => setHoveredMain(slug)}
                onMouseLeave={() => setHoveredMain(null)}
              >
                <label
                  style={{
                    cursor: "pointer",
                    paddingBottom: "2px",
                    borderBottom:
                      selectedMainCategory === slug
                        ? "2px solid #6d40ff"
                        : "2px solid transparent",
                    transition: "border-color 0.3s ease",
                  }}
                  onClick={() => handleMainCategoryRadioChange(slug)}
                >
                  {` ${name}`}
                </label>

                {hoveredMain === slug && (
                  <div
                    className="fallenMenu"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      padding: "10px",
                      minWidth: "150px",
                      zIndex: 1000,
                    }}
                  >
                    {Object.entries(
                      CLOTHING_CATEGORIES[
                        Object.keys(MAIN_CATEGORIES).find(
                          (key) => MAIN_CATEGORIES[key][0] === slug
                        )
                      ] || {}
                    ).map(([subName, [subSlug]]) => (
                      <label
                        onClick={() => handleCategoryRadioChange(subSlug)}
                        key={subSlug}
                        style={{
                          display: "block",
                          padding: "5px 0",
                          cursor: "pointer",
                        }}
                      >
                        {` ${subName}`}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <a href="/favorites" onClick={()=>{handleGoToProduct()}}>Вподобані</a>
        </div>
      )}
    </header>
  );
}
