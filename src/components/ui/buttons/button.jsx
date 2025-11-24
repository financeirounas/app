import { useTheme } from "@/context/theme-context";
import clsx from "clsx";

export default function Button({
  children,
  bg = "primary",
  text = "soft",
  border = null,
  borderWidth = 0,
  hover = "opacity",
  hoverColor = null,
  shadow = "sm", // sombra mais suave por padrão
  onClick = () => {},
  disabled = false,
  loading = false,
  className = "",
  rounded = "pill",    // ⬅️ novo estilo de botão
  ...props
}) {
  const { colors } = useTheme();

  const bgColor = colors[bg] || bg;
  const textColor = colors[text] || text;
  const borderColor = border ? (colors[border] || border) : "transparent";

  const hoverStyles = {
    none: "",
    opacity: "hover:opacity-90",
    darken: "hover:brightness-90",
    lighten: "hover:brightness-110",
    scale: "hover:scale-[1.01]",
  };

  const shadowIntensity = {
    none: "",
    sm: "shadow-[0px_2px_4px_rgba(0,0,0,0.12)]",
    md: "shadow-[0px_3px_6px_rgba(0,0,0,0.16)]",
    lg: "shadow-[0px_6px_14px_rgba(0,0,0,0.20)]",
  };

  const roundedClasses = {
    pill: "rounded-full", // ⬅️ semelhante à imagem
    lg: "rounded-2xl",
    md: "rounded-xl",
    sm: "rounded-lg",
    none: "rounded-none",
  };

  const baseClasses =
    "px-6 py-3 font-semibold text-sm transition-all duration-150 focus:outline-none active:scale-[0.98] select-none";

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  const hoverClass = hoverStyles[hover] || "";
  const shadowClass = shadowIntensity[shadow] || "";
  const roundedClass = roundedClasses[rounded] || "rounded-full";

  const style = {
    backgroundColor: bgColor,
    color: textColor,
    borderColor,
    borderWidth,
  };

  return (
    <button
      {...props}
      className={clsx(
        baseClasses,
        disabledClasses,
        hoverClass,
        shadowClass,
        roundedClass,
        className
      )}
      style={style}
      onClick={(e) => {
        if (!disabled && !loading) onClick(e);
      }}
      disabled={disabled}
    >
      {loading ? "Carregando..." : children}
    </button>
  );
}
