// components/auth/validate-code-desktop.jsx
import { useState, useEffect } from "react";
import Button from "@/components/ui/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/context/theme-context";

export default function ValidateCodeDesktop({ email = "" }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { setThemeColor } = useTheme();

  // Definir a cor do tema ao montar o componente
  useEffect(() => {
    setThemeColor("#0f3b2e27");
  }, [setThemeColor]);


  // ex: 6 dígitos numéricos
  const isValid = code.trim().length === 6;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    // TODO: chamar API para validar o código
    setTimeout(() => {
      setLoading(false);
      console.log("Código validado, seguir para redefinir senha");
      // ex: router.push("/auth/reset-password");
    }, 800);
  };

  const handleResend = () => {
    if (resending) return;
    setResending(true);
    // TODO: chamar API para reenviar código
    setTimeout(() => {
      setResending(false);
      console.log("Código reenviado para", email || "email do usuário");
    }, 800);
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
            Validar código
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Digite o código de verificação enviado para{" "}
            {email ? (
              <span className="font-medium text-slate-700">{email}</span>
            ) : (
              "seu e-mail."
            )}
          </p>
        </header>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="code">Código de verificação</Label>
            <Input
              id="code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <p className="text-xs text-slate-500 mt-2">
              Não recebeu o código?{" "}
              <button
                type="button"
                onClick={handleResend}
                className="text-[#0F3B2E] font-medium underline underline-offset-2 disabled:opacity-50"
                disabled={resending}
              >
                {resending ? "Reenviando..." : "Reenviar código"}
              </button>
            </p>
          </div>

          <div className="flex justify-start text-sm">
            <a
              href="/auth/login"
              className="text-slate-500 hover:text-slate-700 transition-colors"
            >
              Voltar para o login
            </a>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              loading={loading}
              bg={isValid ? "success" : "#F0F4F7"}
              text={isValid ? "soft" : "#9CA3AF"}
              shadow="none"
              disabled={!isValid || loading}
              className="w-full rounded-full py-3 text-[15px]"
            >
              Validar código
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
