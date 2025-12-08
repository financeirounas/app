// components/auth/resend-verify-email-mobile.jsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Button from "@/components/ui/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/context/theme-context";

export default function ResendVerifyEmailMobile() {
  const router = useRouter();
  const { setThemeColor } = useTheme();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
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
    <div className="min-h-screen bg-white flex flex-col px-6 pt-10 pb-10">
      <main className="flex-1">
        <h1 className="text-2xl font-semibold text-[#0F3B2E] mb-4">
          Obter novo código
        </h1>

        <p className="text-sm text-slate-600 mb-6">
          Informe o e-mail cadastrado para enviarmos um novo código de
          verificação.
        </p>

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

          <Button
            type="submit"
            disabled={!isValid || status === "loading"}
            loading={status === "loading"}
            bg={isValid ? "success" : "#F0F4F7"}
            text={isValid ? "soft" : "#9CA3AF"}
            shadow="none"
            rounded="pill"
            className="w-full py-4 text-[15px]"
          >
            Enviar novo código
          </Button>
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
      </main>
    </div>
  );
}
