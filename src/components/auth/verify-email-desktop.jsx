// components/auth/verify-email-desktop.jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Button from "@/components/ui/buttons/button";
import { useTheme } from "@/context/theme-context";

export default function VerifyEmailDesktop() {
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
    <div className="min-h-screen relative flex items-center justify-center bg-white">
      <div className="relative z-10 w-full max-w-lg px-6">
        <div
          className="
            w-full bg-blue-950 rounded-3xl
            shadow-md px-10 py-12
            transition-all text-center
          "
        >
          <header className="mb-6">
            <h1 className="text-3xl font-semibold text-white">
              Verificando e-mail
            </h1>
          </header>

          <p className="mt-2 text-sm text-white/80">
            {status === "loading" &&
              "Aguarde um instante, estamos validando seu código…"}
            {status === "success" && message}
            {status === "error" && message}
          </p>

          {status === "loading" && (
            <div className="mt-6 animate-pulse text-white text-sm">
              Validando código...
            </div>
          )}

          {status === "success" && (
            <div className="mt-6 text-green-300 font-medium text-sm">
              Redirecionando para a tela de login...
            </div>
          )}

          {status === "error" && (
            <div className="mt-8 space-y-4">
              <p className="text-sm text-white/80">
                Você pode tentar novamente com outro código ou solicitar um novo.
              </p>

              <Button
                onClick={() => router.push("/auth/resend-verify-email")}
                bg="primary"
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
        </div>
      </div>
    </div>
  );
}
