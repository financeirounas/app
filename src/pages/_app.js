
import "@/styles/globals.css";
import { ThemeProvider } from "@/context/theme-context"; 

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
