// components/auth/resend-verify-email-desktop.jsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Button from "@/components/ui/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/context/theme-context";

export default function ResendVerifyEmailDesktop() {
  const router = useRouter();
  const { setThemeColor } = useTheme();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const isValid = email.length > 3;

  useEffect(() => {
    setThemeColor("#0f3b2e27");
  }, [setThemeColor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/send-verify-email-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Não foi possível enviar o código.");
        return;
      }

      setStatus("success");
      setMessage("Enviamos um novo código para o seu e-mail.");

      setTimeout(() => {
        router.push("/auth/login");
      }, 2500);
    } catch (err) {
      setStatus("error");
      setMessage("Erro inesperado ao enviar o código.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: "#0f3b2e27" }}
    >
      <div
        className="
          w-full max-w-lg bg-white rounded-3xl border border-slate-200
          shadow-md px-10 py-12
          focus-within:border-[#0F3B2E] focus-within:shadow-[0_0_0px_#0F3B2E]
          transition-all
        "
      >
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-[#0F3B2E]">
            Obter novo código
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Informe o e-mail cadastrado para enviarmos um novo código de
            verificação.
          </p>
        </header>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">E-mail institucional</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu.nome@unas.org.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={!isValid || status === "loading"}
              loading={status === "loading"}
              bg={isValid ? "success" : "#F0F4F7"}
              text={isValid ? "soft" : "#9CA3AF"}
              shadow="none"
              rounded="pill"
              className="w-full py-3 text-[15px]"
            >
              Enviar novo código
            </Button>
          </div>
        </form>

        {status !== "idle" && (
          <p
            className={`mt-4 text-sm text-center ${
              status === "success" ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <p className="text-[11px] text-slate-500 text-center mt-8">
          Caso o e-mail não chegue em alguns minutos, verifique também a caixa
          de spam.
        </p>
      </div>
    </div>
  );
}
