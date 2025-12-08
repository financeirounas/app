// pages/auth/resend-verify-email.jsx
import { useTheme } from "@/context/theme-context";
import ResendVerifyEmailDesktop from "@/components/auth/resend-verify-email-desktop";
import ResendVerifyEmailMobile from "@/components/auth/resend-verify-email-mobile";

export default function ResendVerifyEmailPage() {
  const { isMobile } = useTheme();

  if (isMobile) {
    return <ResendVerifyEmailMobile />;
  }

  return <ResendVerifyEmailDesktop />;
}
