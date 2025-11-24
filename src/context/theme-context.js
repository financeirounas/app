import { createContext, useContext, useEffect, useState } from "react";
import Head from "next/head";

const ThemeContext = createContext(null);
const DEFAULT_COLOR = "#ffffff";

export function ThemeProvider({ children }) {
  const [themeColor, setThemeColor] = useState(DEFAULT_COLOR);

  useEffect(() => {
    if (typeof document === "undefined") return;

    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", themeColor);

    document.documentElement.style.setProperty(
      "--status-bar-color",
      themeColor
    );
  }, [themeColor]);

  const value = {
    themeColor,
    setThemeColor,
  };

  return (
    <ThemeContext.Provider value={value}>
      <Head>
        <meta name="theme-color" content={themeColor} />
      </Head>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme deve ser usado dentro de <ThemeProvider>");
  }
  return ctx;
}
