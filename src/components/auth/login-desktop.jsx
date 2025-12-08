import { useState, useEffect, use } from "react";
import Button from "@/components/ui/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import Link from "next/link";
import { useRouter } from "next/router";
import { AppAlert } from "@/components/ui/app-alert";

export default function LoginDesktop() {
  const { setThemeColor } = useTheme();
  const router = useRouter();

  useEffect(() => {
    setThemeColor("#0f3b2e27");
  }, [setThemeColor]);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValid = email.length > 3 && password.length > 3;

  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);

    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          router.push("/");
        } else if (data.error) {
          setError(data.error);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Erro ao comunicar com a API Next.js:", err);
        setError("Erro ao comunicar com a API. Tente novamente.");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-white">
      {/* Formulário de Login Centralizado */}
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
              Acessar conta
            </h1>
          </header>

          {error && (
            <div className="mb-4">
              <AppAlert type="error" title="Erro ao logar" message={error} />
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="text-white">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.nome@unas.org.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  className="pr-12 tracking-wider"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 active:scale-95 transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-start">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-white font-medium underline underline-offset-2"
              >
                Esqueceu sua senha?
              </Link>
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
                Acessar conta
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
