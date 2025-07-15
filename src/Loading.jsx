import { useEffect } from "react";

export default function Loading() {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div style={styles.overlay}>
      <img src="/logo.png" alt="Logo" style={styles.logo} />
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh", // ❗ було height: "auto", треба фіксована висота!
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  logo: {
    width: "700px",
    height: "700px",
    animation: "spin 10s linear infinite",
  },
};
