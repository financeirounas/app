import React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(function Input(
  { className, type = "text", ...props },
  ref
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        // estilo base
        "flex w-full h-14 rounded-2xl bg-white px-5 text-[15px] font-medium transition-all",

        // cor do texto (não cinza claro)
        "text-gray-900",

        // borda normal quase invisível (mas mantém layout)
        "border border-slate-300/40",

        // placeholder
        "placeholder:text-slate-400",

        // foco = borda verde UNAS
        "focus-visible:outline-none focus-visible:ring-0.5 focus-visible:ring-[var(--unas-primary,#0F3B2E)] focus-visible:border-[var(--unas-primary,#0F3B2E)]",

        // remove ring-offset esquisito
        "focus-visible:ring-offset-0",

        // disabled
        "disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed",

        className
      )}
      {...props}
    />
  );
});

export { Input };
