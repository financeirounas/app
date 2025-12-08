import { Loader2 } from "lucide-react";

export function Spinner({ size = 20, color = "#0F3B2E" }) {
  return (
    <Loader2
      className="animate-spin"
      style={{ width: size, height: size, color }}
    />
  );
}
