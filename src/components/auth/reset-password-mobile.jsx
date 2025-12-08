import { useState, useEffect } from "react";
import Button from "@/components/ui/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { useRouter } from "next/router";
import { AppAlert } from "@/components/ui/app-alert";
import Link from "next/link";
export default function ResetPasswordMobile() {
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
    if (!token){
      setError("Token na url inválido ou ausente.");
      router.push("/auth/forgot-password");
      return;
    }
    
    if (!passwordsMatch){
      setError("As senhas não coincidem ou são muito curtas.");
      return;
    };

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
    <div className="min-h-screen flex flex-col px-6 py-10 bg-[#f6f7f8]">
      
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0F3B2E]">
          Nova senha
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Escolha uma nova senha segura.
        </p>
      </header>

      <main className="flex-1">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
                      <div className="mb-4">
                        <AppAlert
                          type="error"
                          title="Erro ao tentar recuperar senha"
                          message={error}
                        />
                      </div>
                    )}
          <div>
            <Label>Nova senha</Label>
            <div className="relative">
              <Input
                type={show1 ? "text" : "password"}
                placeholder="Digite a nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShow1((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0F3B2E]/70"
              >
                {show1 ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          
          <div>
            <Label>Confirmar senha</Label>
            <div className="relative">
              <Input
                type={show2 ? "text" : "password"}
                placeholder="Repita a senha"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShow2((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0F3B2E]/70"
              >
                {show2 ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {confirm.length > 0 && !passwordsMatch && (
              <p className="text-xs text-red-500 mt-1">
                As senhas não coincidem.
              </p>
            )}
          </div>

          
          <Button
            type="submit"
            disabled={!passwordsMatch}
            bg={passwordsMatch ? "success" : "#E5E7EB"}
            text={passwordsMatch ? "soft" : "#9CA3AF"}
            className="w-full rounded-full py-3 text-[15px]"
          >
            Confirmar nova senha
          </Button>
        </form>
      </main>

      <footer className="text-center mt-10">
        <Link href="/auth/login" className="text-sm text-[#0F3B2E] underline underline-offset-2">
          Voltar ao login
        </Link>
      </footer>
    </div>
  );
}
