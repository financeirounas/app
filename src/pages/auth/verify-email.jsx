// pages/auth/verify-email.jsx
import { useTheme } from "@/context/theme-context";
import VerifyEmailDesktop from "@/components/auth/verify-email-desktop";
import VerifyEmailMobile from "@/components/auth/verify-email-mobile";

export default function VerifyEmailPage() {
  const { isMobile } = useTheme();

  if (isMobile) {
    return <VerifyEmailMobile />;
  }

  return <VerifyEmailDesktop />;
}
