// src/components/ui/label.jsx
import React from "react";
import { cn } from "@/lib/utils";

const Label = React.forwardRef(function Label({ className, ...props }, ref) {
  return (
    <label
      ref={ref}
      className={cn(
        "block text-sm font-semibold text-[#0F3B2E] mb-2",
        className
      )}
      {...props}
    />
  );
});

Label.displayName = "Label";

export { Label };
