// components/Header.js
import { useTheme } from "@/context/ThemeContext";

export default function Header() {
  const { themeColor, setThemeColor } = useTheme();

  function handleSetBlue() {
    setThemeColor("#1976d2");
  }

  function handleSetDark() {
    setThemeColor("#000000");
  }

  function handleSetLight() {
    setThemeColor("#ffffff");
  }

  return (
    <header
      style={{
        backgroundColor: themeColor,
        color: themeColor === "#000000" ? "#ffffff" : "#000000",
        padding: "16px",
        marginBottom: "16px",
        borderRadius: 8,
      }}
    >
      <h1>Finance Manager</h1>

      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button onClick={handleSetBlue}>Azul</button>
        <button onClick={handleSetDark}>Escuro</button>
        <button onClick={handleSetLight}>Claro</button>
      </div>
    </header>
  );
}
