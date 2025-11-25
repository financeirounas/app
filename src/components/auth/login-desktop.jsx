import { useState, useEffect } from "react";
import Button from "@/components/ui/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import Link from "next/link";

export default function LoginDesktop() {
  const { setThemeColor } = useTheme();

  useEffect(() => {
    setThemeColor("#0f3b2e27");
  }, [setThemeColor]);



  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValid = email.length > 3 && password.length > 3;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
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
            Acessar conta
          </h1>
        </header>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu.nome@unas.org.br"
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
          </div>

          <div className="flex justify-start">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-[#0F3B2E] font-medium underline underline-offset-2"
            >
              Esqueceu sua senha?
            </Link>
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
              Acessar conta
            </Button>
          </div>
        </form>

        <p className="text-[11px] text-slate-500 text-center mt-8">
          Painel exclusivo para colaboradores e parceiros da UNAS.
        </p>
      </div>
    </div>
  );
}
