import { useState } from "react";
import Button from "@/components/ui/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/context/theme-context";

export default function ForgotPasswordMobile() {
  const { setThemeColor } = useTheme();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const isValid = email.includes("@") && email.length > 5;

  useEffect(() => {
    setThemeColor("#0f3b2e27");
  }, [setThemeColor]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!isValid) return;

    // TODO: enviar email para backend
    setSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-10 bg-[#f6f7f8]">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0F3B2E]">
          Recuperar senha
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Informe seu e-mail institucional para continuar.
        </p>
      </header>

      {/* Conteúdo */}
      <main className="flex-1">
        {!sent ? (
          <form className="space-y-6" onSubmit={handleSend}>
            <div>
              <Label>E-mail</Label>
              <Input
                placeholder="seu.nome@unas.org.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

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
        ) : (
          <div className="mt-8 text-center">
            <p className="text-slate-700 text-sm">
              Um código foi enviado para:
            </p>
            <p className="mt-1 font-medium text-[#0F3B2E]">{email}</p>

            <p className="mt-4 text-xs text-slate-500">
              Verifique sua caixa de entrada e prossiga para validar.
            </p>
          </div>
        )}
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
