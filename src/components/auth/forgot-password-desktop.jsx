import { useState, useEffect } from "react";
import Button from "@/components/ui/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/context/theme-context";
import { AppAlert } from "@/components/ui/app-alert";
import { useRouter } from "next/router";

export default function ForgotPasswordDesktop() {
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
    if (!isCodeValid){
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
          router.push(`/auth/reset-password?token=${data.reset_password_token}`);
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
              {step === "email" ? "Esqueceu sua senha?" : "Verifique seu e-mail"}
            </h1>
            {error && (
              <div className="mb-4 mt-4">
                <AppAlert
                  type="error"
                  title="Erro ao tentar recuperar senha"
                  message={error}
                />
              </div>
            )}

            {step === "email" ? (
              <p className="text-sm text-white/80 mt-2">
                Informe seu e-mail institucional para enviarmos um código de
                recuperação.
              </p>
            ) : (
              <p className="text-sm text-white/80 mt-2">
                Enviamos um código de verificação para{" "}
                <span className="font-medium text-white">{email}</span>.
                Digite o código abaixo para continuar.
              </p>
            )}
          </header>

          <form className="space-y-6" onSubmit={onSubmit}>
            {step === "email" ? (
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
            ) : (
              <div>
                <Label htmlFor="code" className="text-white">Código de verificação</Label>
                <Input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  placeholder="Digite o código recebido"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <p className="text-xs text-white/70 mt-2">
                  Não recebeu o código?{" "}
                  <button
                    type="button"
                    className="text-white font-medium underline underline-offset-2"
                    onClick={handleSendCode}
                  >
                    Reenviar código
                  </button>
                </p>
              </div>
            )}
            <div className="flex justify-start text-sm">
              <a
                href="/auth/login"
                className="text-white hover:text-white/80 transition-colors"
              >
                Voltar para o login
              </a>
            </div>
            <div className="pt-2">
              <Button
                type="submit"
                loading={loading}
                bg={isValid ? "primary" : "#F0F4F7"}
                text={isValid ? "soft" : "#9CA3AF"}
                shadow="none"
                disabled={!isValid || loading}
                className="w-full rounded-full py-3 text-[15px]"
              >
                {step === "email" ? "Enviar código" : "Validar código"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
