// pages/auth/validate-code.jsx
import { useTheme } from "@/context/theme-context";
import ValidateCodeDesktop from "@/components/auth/validate-code-desktop";
import ValidateCodeMobile from "@/components/auth/validate-code-mobile";

export default function ValidateCodePage() {
  const { isMobile } = useTheme();

  if (isMobile) {
    return <ValidateCodeMobile />;
  }

  return <ValidateCodeDesktop />;
}
