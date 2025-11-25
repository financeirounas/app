import { useState, useEffect } from "react";
import Button from "@/components/ui/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/context/theme-context";
import { useRouter } from "next/router";

export default function ForgotPasswordMobile() {
  const router = useRouter();
  const { setThemeColor } = useTheme();

  const [step, setStep] = useState("email");

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");

  const [code, setCode] = useState("");

  const [error, setError] = useState(null);

  const isEmailValid = email.length > 3 && email.includes("@");

  const isCodeValid = code.length >= 4;

  useEffect(() => {
    setThemeColor("#0f3b2e27");
  }, [setThemeColor]);

  const handleSendCode = (e) => {
    e.preventDefault();
    if (!isEmailValid) {
      setError("Por favor, insira um e-mail válido.");
      return;
    }

    fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setStep("code");
        } else if (data.error) {
          setError(data.error);
        }
      })
      .catch((err) => {
        console.error("Erro ao comunicar com a API Next.js:", err);
        setError("Erro ao comunicar com a API. Tente novamente.");
      });

    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleValidateCode = (e) => {
    e.preventDefault();
    if (!isCodeValid) {
      setError("Por favor, insira um código válido.");
      return;
    }
    fetch("/api/auth/validate-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.reset_password_token) {
          router.push(
            `/auth/reset-password?token=${data.reset_password_token}`
          );
        } else if (data.error) {
          setError(data.error);
        }
      })
      .catch((err) => {
        console.error("Erro ao comunicar com a API Next.js:", err);
        setError("Erro ao comunicar com a API. Tente novamente.");
      });

    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const onSubmit = step === "email" ? handleSendCode : handleValidateCode;
  const isValid = step === "email" ? isEmailValid : isCodeValid;

  return (
    <div className="min-h-screen flex flex-col px-6 py-10 bg-[#f6f7f8]">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0F3B2E]">
          Recuperar senha
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Informe seu e-mail institucional para continuar.
        </p>
      </header>

      <main className="flex-1">
        <form className="space-y-6" onSubmit={onSubmit}>
          {step === "email" ? (
            <div>
              <Label>E-mail</Label>
              <Input
                placeholder="seu.nome@unas.org.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          ) : (
            <div>
              <div>
                <Label>Código de verificação</Label>
                <Input
                  placeholder="000000"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>

              <p className="text-xs text-slate-500 mt-2">
                Não recebeu o código?{" "}
                <button
                  type="button"
                  className="text-[#0F3B2E] font-medium underline underline-offset-2"
                  onClick={handleSendCode}
                >
                  Reenviar código
                </button>
              </p>
            </div>
          )}
          <Button
            type="submit"
            disabled={!isValid}
            bg={isValid ? "success" : "#E5E7EB"}
            text={isValid ? "soft" : "#9CA3AF"}
            className="w-full rounded-full py-3 text-[15px]"
          >
            Enviar código
          </Button>
        </form>
      </main>

      {/* Footer */}
      <footer className="text-center mt-10">
        <a
          href="/auth/login"
          className="text-sm text-[#0F3B2E] underline underline-offset-2"
        >
          Voltar ao login
        </a>
      </footer>
    </div>
  );
}
