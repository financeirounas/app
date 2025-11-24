/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useContext, useEffect, useState } from "react";
import Head from "next/head";
import colors from "@/config/colors";


const ThemeContext = createContext(null);
const DEFAULT_COLOR = "#ffffff";

/**
 * Hook para gerenciar a cor da status bar / theme-color
 */
function useStatusBarColor(themeColor) {
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
}

/**
 * Hook para detectar se o device é mobile ou desktop
 */
function useDeviceType() {
  const [device, setDevice] = useState("desktop");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const detectDevice = () => {
      const isMobileUA = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(
        navigator.userAgent
      );
      const isNarrow = window.matchMedia("(max-width: 768px)").matches;

      return isMobileUA || isNarrow ? "mobile" : "desktop";
    };

    
    setDevice(detectDevice());

    const mql = window.matchMedia("(max-width: 768px)");
    const handleChange = (e) => {
      setDevice(e.matches ? "mobile" : "desktop");
    };

    if (mql.addEventListener) {
      mql.addEventListener("change", handleChange);
    } else {
      mql.addListener(handleChange);
    }

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", handleChange);
      } else {
        mql.removeListener(handleChange);
      }
    };
  }, []);

  return {
    device,
    isMobile: device === "mobile",
    isDesktop: device === "desktop",
  };
}


/**
 * Provider do tema da aplicação
 */
export function ThemeProvider({ children }) {
  const [themeColor, setThemeColor] = useState(DEFAULT_COLOR);

  useStatusBarColor(themeColor);
  const { device, isMobile, isDesktop } = useDeviceType();

  const value = {
    themeColor,
    setThemeColor,
    device,
    isMobile,
    isDesktop,
    colors
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
