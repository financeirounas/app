import { useState } from "react";
import Button from "@/components/ui/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "@/context/theme-context";

export default function ResetPasswordMobile() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const { setThemeColor } = useTheme();
  const passwordsMatch = password.length >= 6 && password === confirm;
  
  
  useEffect(() => {
    setThemeColor("#0f3b2e27");
  }, [setThemeColor]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passwordsMatch) return;

    // TODO: chamar API
    console.log("Senha redefinida!");
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-10 bg-[#f6f7f8]">
      {/* Header */}
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
          {/* Senha */}
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

          {/* Confirmar senha */}
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

          {/* Botão */}
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
