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
    <div className="min-h-screen relative flex items-center justify-center bg-white">
      <div className="relative z-10 w-full max-w-lg px-6">
        <div
          className="
            w-full bg-blue-950 rounded-3xl
            shadow-md px-10 py-12
            transition-all
          "
        >
          <header className="mb-8">
            <h1 className="text-3xl font-semibold text-white">
              Obter novo código
            </h1>
            <p className="mt-2 text-sm text-white/80">
              Informe o e-mail cadastrado para enviarmos um novo código de
              verificação.
            </p>
          </header>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="text-white">E-mail institucional</Label>
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
                bg={isValid ? "primary" : "#F0F4F7"}
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
                status === "success" ? "text-green-300" : "text-red-300"
              }`}
            >
              {message}
            </p>
          )}

          <p className="text-[11px] text-white/70 text-center mt-8">
            Caso o e-mail não chegue em alguns minutos, verifique também a caixa
            de spam.
          </p>
        </div>
      </div>
    </div>
  );
}
