// components/auth/LoginMobile.jsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "@/components/ui/buttons/button";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/context/theme-context";

export default function LoginMobile() {
  const { setThemeColor } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isValid = email.length > 3 && password.length > 3;
  
  
  useEffect(() => {
    setThemeColor("#0f3b2e27");
  }, [setThemeColor]);

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-4 pb-10">
      <header className="flex items-center gap-3 mb-6"></header>

      {/* Conteúdo */}
      <main className="flex-1">
        <h1 className="text-2xl font-semibold text-[#0F3B2E] mb-6">
          Acessar conta
        </h1>

        {/* Formulário */}
        <form className="space-y-6">
          {/* Email */}
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

          {/* Senha */}
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

              {/* Botão de mostrar/ocultar senha */}
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

          {/* Esqueci minha senha */}

          <div className="flex justify-start">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-[#0F3B2E] font-medium underline underline-offset-2"
            >
              Esqueceu sua senha?
            </Link>
          </div>
        </form>
      </main>

      {/* Rodapé — botão inferior */}
      <footer className="mt-10 mb-6">
        <Button
          bg={isValid ? "success" : "#F0F4F7"}
          text={isValid ? "soft" : "#9CA3AF"}
          shadow="none"
          disabled={!isValid}
          className="w-full rounded-full py-4 text-[15px]"
        >
          Acessar conta
        </Button>
      </footer>
    </div>
  );
}
