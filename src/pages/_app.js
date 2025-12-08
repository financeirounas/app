/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/set-state-in-effect */

import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { ThemeProvider, useTheme } from "@/context/theme-context";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";

import MobileLayout from "@/components/layouts/layout-mobile";
import DesktopLayout from "@/components/layouts/layout-desktop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

function LayoutSelector({ children }) {
  const { isMobile } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="font-sans" />;
  }

  // Páginas do dashboard já têm seu próprio layout (DashboardLayout)
  // Páginas de auth não usam layout (têm seu próprio layout interno)
  const isDashboardPage =
    router.pathname === "/" ||
    router.pathname === "/pedidos" ||
    router.pathname === "/frequencia" ||
    router.pathname === "/estoque" ||
    router.pathname === "/relatorios";

  const isAuthPage = router.pathname.startsWith("/auth");

  // Se for página do dashboard ou auth, não aplica layout
  if (isDashboardPage || isAuthPage) {
    return <>{children}</>;
  }

  // Para outras páginas, aplica o layout padrão
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
