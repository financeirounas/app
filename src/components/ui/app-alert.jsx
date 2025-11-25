import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export function AppAlert({ type = "error", title, message }) {
  const isError = type === "error";

  return (
    <Alert
      className={
        isError
          ? "border-red-300 bg-white text-red-700"
          : "border-green-300 bg-green-50 text-green-700"
      }
    >
      <AlertTitle className="flex items-center gap-2">
        {isError ? (
          <AlertTriangle className="w-5 h-5" />
        ) : (
          <CheckCircle2 className="w-5 h-5" />
        )}
        {title}
      </AlertTitle>

      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
