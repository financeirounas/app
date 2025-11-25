// components/auth/verify-email-mobile.jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Button from "@/components/ui/buttons/button";
import { useTheme } from "@/context/theme-context";

export default function VerifyEmailMobile() {
  const router = useRouter();
  const { code } = router.query;
  const { setThemeColor } = useTheme();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setThemeColor("#0f3b2e27");
  }, [setThemeColor]);

  useEffect(() => {
    if (!code) return;

    async function verify() {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setMessage(data.error || "Não foi possível validar seu e-mail.");
          return;
        }

        setStatus("success");
        setMessage("Seu e-mail foi validado com sucesso!");

        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } catch (err) {
        setStatus("error");
        setMessage("Erro inesperado ao validar e-mail.");
      }
    }

    verify();
  }, [code, router]);

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-10 pb-10">
      <main className="flex-1">
        <h1 className="text-2xl font-semibold text-[#0F3B2E] mb-4">
          Verificando e-mail
        </h1>

        <p className="text-sm text-slate-600">
          {status === "loading" &&
            "Aguarde um instante, estamos validando seu código…"}
          {status === "success" && message}
          {status === "error" && message}
        </p>

        {status === "loading" && (
          <div className="mt-4 animate-pulse text-[#0F3B2E] text-sm">
            Validando código...
          </div>
        )}

        {status === "success" && (
          <div className="mt-4 text-green-600 font-medium text-sm">
            Redirecionando para a tela de login...
          </div>
        )}

        {status === "error" && (
          <div className="mt-8 space-y-3">
            <p className="text-sm text-slate-600">
              Você pode tentar novamente com outro código ou solicitar um novo.
            </p>

            <Button
              onClick={() => router.push("/auth/resend-verify-email")}
              bg="success"
              text="soft"
              hover="darken"
              shadow="none"
              rounded="pill"
              className="w-full py-3 text-[15px]"
            >
              Obter novo código
            </Button>

            <Button
              onClick={() => router.push("/auth/login")}
              bg="#F0F4F7"
              text="#374151"
              hover="opacity"
              shadow="none"
              rounded="pill"
              className="w-full py-3 text-[14px]"
            >
              Voltar para login
            </Button>
          </div>
        )}
      </main>

      <p className="text-[11px] text-slate-500 text-center mt-8">
        Painel exclusivo para colaboradores e parceiros da UNAS.
      </p>
    </div>
  );
}
