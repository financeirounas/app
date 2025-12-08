import { useState, useEffect } from "react";
import Button from "@/components/ui/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { AppAlert } from "@/components/ui/app-alert";
import { useRouter } from "next/router";

export default function ResetPasswordDesktop() {
  const router = useRouter();
  const token = router.query.token;
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const { setThemeColor } = useTheme();
  const passwordsMatch = password.length >= 6 && password === confirm;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setThemeColor("#0f3b2e27");
  }, [setThemeColor]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!token) {
      setError("Token na url inválido ou ausente.");
      router.push("/auth/forgot-password");
      return;
    }

    if (!passwordsMatch) {
      setError("As senhas não coincidem ou são muito curtas.");
      return;
    }

    fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, confirm, token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          router.push("/");
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
          {/* Cabeçalho */}
          <header className="mb-8">
            <h1 className="text-3xl font-semibold text-white">
              Definir nova senha
            </h1>
            <p className="text-sm text-white/80 mt-2">
              Crie uma nova senha segura para acessar o painel financeiro.
            </p>
          </header>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4">
                <AppAlert
                  type="error"
                  title="Erro ao tentar redefinir senha"
                  message={error}
                />
              </div>
            )}

            <div>
              <Label htmlFor="password" className="text-white">Nova senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={show1 ? "text" : "password"}
                  placeholder="Digite a nova senha"
                  className="pr-12 tracking-wider"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShow1((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 active:scale-95 transition"
                >
                  {show1 ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-white/70 mt-1">
                Use ao menos 6 caracteres. Evite senhas fáceis de adivinhar.
              </p>
            </div>
            <div>
              <Label htmlFor="confirm" className="text-white">Confirmar senha</Label>
              <div className="relative">
                <Input
                  id="confirm"
                  type={show2 ? "text" : "password"}
                  placeholder="Repita a nova senha"
                  className="pr-12 tracking-wider"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShow2((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 active:scale-95 transition"
                >
                  {show2 ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {confirm.length > 0 && !passwordsMatch && (
                <p className="text-xs text-red-300 mt-1">
                  As senhas não coincidem.
                </p>
              )}
            </div>

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
                bg={passwordsMatch ? "primary" : "#F0F4F7"}
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
    </div>
  );
}
