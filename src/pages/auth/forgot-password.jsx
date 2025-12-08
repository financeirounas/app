// pages/auth/forgot-password.jsx
import { useTheme } from "@/context/theme-context";
import ForgotPasswordDesktop from "@/components/auth/forgot-password-desktop";
import ForgotPasswordMobile from "@/components/auth/forgot-password-mobile";

export default function ForgotPasswordPage() {
  const { isMobile } = useTheme();

  if (isMobile) {
    return <ForgotPasswordMobile />;
  }

  return <ForgotPasswordDesktop />;
}
