import { useTheme } from "@/context/theme-context";
import clsx from "clsx";

export default function ButtonIcon({
  icon,
  children,
  size = "md",
  bg = "primary",
  color = "soft",
  shadow = "md",
  rounded = "full",     // ⬅️ NOVO
  onClick = () => {},
  disabled = false,
  loading = false,
  className = "",
  ...props
}) {
  const { colors } = useTheme();

  const bgColor = colors[bg] || bg;
  const textColor = colors[color] || color;

  const sizeClasses = {
    sm: "w-9 h-9 text-xs",
    md: "w-11 h-11 text-sm",
    lg: "w-14 h-14 text-base",
    xl: "w-16 h-16 text-lg",
  };

  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
  };

  // NOVO → mapa de bordas
  const roundedClasses = {
    full: "rounded-full",
    lg: "rounded-2xl",
    md: "rounded-xl",
    sm: "rounded-lg",
    none: "rounded-none",
  };

  const baseClasses =
    "inline-flex items-center justify-center transition-all duration-150 active:scale-[0.96] focus:outline-none";

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  const style = {
    backgroundColor: bgColor,
    color: textColor,
    boxShadow: shadow === "none" ? undefined : `0 4px 12px ${bgColor}40`,
  };

  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick(e);
  };

  return (
    <button
      {...props}
      type="button"
      className={clsx(
        baseClasses,
        sizeClasses[size] || sizeClasses.md,
        roundedClasses[rounded] || rounded,
        shadowClasses[shadow] || "",
        disabledClasses,
        className
      )}
      style={style}
      onClick={handleClick}
      disabled={disabled}
    >
      {loading ? (
        <span className="animate-spin text-[1.1em]">⏳</span>
      ) : (
        icon || children
      )}
    </button>
  );
}
