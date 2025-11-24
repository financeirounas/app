import { use, useEffect, useState } from "react";
import Button from "@/components/ui/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/context/theme-context";



export default function ValidateCodeMobile() {
  const [code, setCode] = useState("");
  const isValid = code.length === 6;
  const { setThemeColor } = useTheme();

  useEffect(() => {
    setThemeColor("#0f3b2e27");
  }, [setThemeColor]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    // TODO: validar código no backend
    console.log("Código validado");
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-10 bg-[#f6f7f8]">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-[#0F3B2E]">
          Validar código
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Insira o código enviado ao seu e-mail.
        </p>
      </header>

      {/* Form */}
      <main className="flex-1">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label>Código de verificação</Label>
            <Input
              placeholder="000000"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            disabled={!isValid}
            bg={isValid ? "success" : "#E5E7EB"}
            text={isValid ? "soft" : "#9CA3AF"}
            className="w-full rounded-full py-3 text-[15px]"
          >
            Validar código
          </Button>
        </form>

        <button
          className="text-sm text-[#0F3B2E] underline underline-offset-2 mt-4"
          onClick={() => console.log("reenviar código")}
        >
          Reenviar código
        </button>
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
