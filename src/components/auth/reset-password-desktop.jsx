// components/auth/ResetPasswordDesktop.jsx
import { useState, useEffect } from "react";
import Button from "@/components/ui/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "@/context/theme-context";

export default function ResetPasswordDesktop() {
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { setThemeColor } = useTheme();

  useEffect(() => {
    setThemeColor("#0f3b2e27");
  }, [setThemeColor]);

  const passwordsMatch = password.length >= 6 && password === confirm;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passwordsMatch) return;

    setLoading(true);
    // TODO: chamar API para redefinir a senha
    setTimeout(() => {
      setLoading(false);
      // TODO: redirecionar para login
      console.log("Senha redefinida com sucesso");
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
          focus-within:border-[#0F3B2E] focus-within:shadow-[0_0_0_1px_#0F3B2E]
          transition-all
        "
      >
        {/* Cabeçalho */}
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-[#0F3B2E]">
            Definir nova senha
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Crie uma nova senha segura para acessar o painel financeiro.
          </p>
        </header>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Nova senha */}
          <div>
            <Label htmlFor="password">Nova senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite a nova senha"
                className="pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0F3B2E]/70 active:scale-95 transition"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Use ao menos 6 caracteres. Evite senhas fáceis de adivinhar.
            </p>
          </div>

          {/* Confirmar senha */}
          <div>
            <Label htmlFor="confirm">Confirmar senha</Label>
            <div className="relative">
              <Input
                id="confirm"
                type={showConfirm ? "text" : "password"}
                placeholder="Repita a nova senha"
                className="pr-12"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0F3B2E]/70 active:scale-95 transition"
              >
                {showConfirm ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {confirm.length > 0 && !passwordsMatch && (
              <p className="text-xs text-red-500 mt-1">
                As senhas não coincidem.
              </p>
            )}
          </div>

          {/* Voltar para login */}
          <div className="flex justify-start text-sm">
            <a
              href="/auth/login"
              className="text-slate-500 hover:text-slate-700 transition-colors"
            >
              Voltar para o login
            </a>
          </div>

          {/* Botão principal */}
          <div className="pt-2">
            <Button
              type="submit"
              loading={loading}
              bg={passwordsMatch ? "success" : "#F0F4F7"}
              text={passwordsMatch ? "soft" : "#9CA3AF"}
              shadow="none"
              disabled={!passwordsMatch || loading}
              className="w-full rounded-full py-3 text-[15px]"
            >
              Confirmar nova senha
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
