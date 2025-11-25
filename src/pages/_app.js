/* eslint-disable react-hooks/set-state-in-effect */
// pages/_app.js
import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { ThemeProvider, useTheme } from "@/context/theme-context";
import { Inter } from "next/font/google";
import MobileLayout from "@/components/layouts/layout-mobile";
import DesktopLayout from "@/components/layouts/layout-desktop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

function LayoutSelector({ children }) {
  const { isMobile } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={`${inter.variable} font-sans`} />;
  }
  const Layout = isMobile ? MobileLayout : DesktopLayout;
  return <Layout>{children}</Layout>;
}

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("Service Worker registrado"))
        .catch((err) => console.error("Erro ao registrar SW:", err));
    }
  }, []);

  return (
    <ThemeProvider>
      <main className={`${inter.variable} font-sans`}>
        <LayoutSelector>
          <Component {...pageProps} />
        </LayoutSelector>
      </main>
    </ThemeProvider>
  );
}
