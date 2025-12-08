// pages/login.jsx
import LoginMobile from "@/components/auth/login-mobile";
import LoginDesktop from "@/components/auth/login-desktop";
import { useTheme } from "@/context/theme-context";

export default function LoginPage() {
  const { isMobile } = useTheme();
  if (isMobile) {
    return <LoginMobile />;
  }

  return <LoginDesktop />;
}
