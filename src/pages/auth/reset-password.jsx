import { useTheme } from "@/context/theme-context";
import ResetPasswordDesktop from "@/components/auth/reset-password-desktop";
import ResetPasswordMobile from "@/components/auth/reset-password-mobile";

export default function ResetPasswordPage() {
  const { isMobile } = useTheme();

  if (isMobile) {
    return <ResetPasswordMobile />;
  }

  return <ResetPasswordDesktop />;
}
