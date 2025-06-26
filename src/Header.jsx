import React, { useState } from "react";

export default function PageLayout({ children, filters }) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    <div style={styles.pageWrapper}>
      <header style={styles.header}>
        <div style={styles.logo}>🛍️ Лого</div>
        <button onClick={() => setIsSidebarVisible(!isSidebarVisible)} style={styles.toggleButton}>
          {isSidebarVisible ? "Сховати фільтри" : "Показати фільтри"}
        </button>
      </header>

      <div style={styles.contentWrapper}>
        {isSidebarVisible && (
          <aside style={styles.sidebar}>
            {filters}
          </aside>
        )}

        <main style={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  );
}
