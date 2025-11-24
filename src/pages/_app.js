import "@/styles/globals.css";
import { useEffect } from "react";
import { ThemeProvider } from "@/context/theme-context";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

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
        <Component {...pageProps} />
      </main>
    </ThemeProvider>
  );
}
