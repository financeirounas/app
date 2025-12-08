// components/auth/LoginMobile.jsx
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "@/components/ui/buttons/button";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/context/theme-context";
import { useRouter } from "next/router";
import { AppAlert } from "@/components/ui/app-alert";

export default function LoginMobile() {
  const { setThemeColor } = useTheme();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isValid = email.length > 3 && password.length > 3;

  const [error, setError] = useState(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

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
        }
      })
      .catch((err) => {
        console.error("Erro ao comunicar com a API Next.js:", err);
        setError("Erro ao comunicar com a API. Tente novamente.");
      });

    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setThemeColor("#0f3b2e27");
  }, [setThemeColor]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-4 pb-10">
      <main className="flex-1">
        <h1 className="text-2xl font-semibold text-[#0F3B2E] mb-6">
          Acessar conta
        </h1>

        {error && (
          <div className="mb-4">
            <AppAlert type="error" title="Erro ao logar" message={error} />
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
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
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0F3B2E]/70 active:scale-95 transition"
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
              className="text-sm text-[#0F3B2E] font-medium underline underline-offset-2"
            >
              Esqueceu sua senha?
            </Link>
          </div>

          <footer className="mt-20 mb-6">
            <Button
              type="submit"
              loading={loading}
              bg={isValid ? "success" : "#F0F4F7"}
              text={isValid ? "soft" : "#9CA3AF"}
              shadow="none"
              disabled={!isValid || loading}
              className="w-full rounded-full py-4 text-[15px]"
            >
              Acessar conta
            </Button>
          </footer>
        </form>
      </main>
    </div>
  );
}
