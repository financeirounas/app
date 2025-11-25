import { useRouter } from "next/router";
import { useTheme } from "@/context/theme-context";
import { User, ArrowLeft, Home, BarChart2, CreditCard, Settings, Bell } from "lucide-react";
import ButtonIcon from "@/components/ui/buttons/button-icon";
import clsx from "clsx";

export default function MobileLayout({ children }) {
  const router = useRouter();
  const { colors } = useTheme();

  const success = colors.success || "#16a34a";
  const soft = colors.soft || "#ffffff";
  const surface = colors.surface || "#F6FBF6";
  const bg = colors.background || "#F2F6F2";
  const muted = colors.muted || "#9CA3AF";

  const navItems = [
    { icon: <Home size={20} />, label: "Início", href: "/" },
    { icon: <CreditCard size={20} />, label: "Cartões", href: "/cards" },
    { icon: <BarChart2 size={20} />, label: "Resumo", href: "/stats" },
    { icon: <Settings size={20} />, label: "Conta", href: "/settings" },
  ];

  const canGoBack = router.asPath !== "/";

  return (
    <div
      className="flex flex-col min-h-screen text-gray-900"
      style={{
        background: bg,
      }}
    >
      <header
        className="flex items-center justify-between px-5 pt-6 pb-3"
        aria-label="Topbar"
      >
        <div className="flex items-center">
          <ButtonIcon
            icon={<User size={18} />}
            size="md"
            bg={surface}
            color={success}
            shadow="none"
            rounded="full"
            onClick={() => router.push("/profile")}
            className="border border-transparent"
          />
          <div>
            <div className="text-sm font-semibold">Olá Eduardo</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white shadow-sm"
            aria-label="Notificações"
            onClick={() => router.push("/notifications")}
            style={{ border: "1px solid rgba(0,0,0,0.04)" }}
          >
            <Bell size={18} color={success} />
          </button>

          {canGoBack && (
            <ButtonIcon
              icon={<ArrowLeft size={18} />}
              size="md"
              bg="#fff"
              color={success}
              shadow="none"
              rounded="full"
              onClick={() => router.back()}
              className="border border-transparent"
            />
          )}
        </div>
      </header>

      {/* Conteúdo - área com padding e cards brancos */}
      <main className="flex-1 px-5 pb-28">
          <div>{children}</div>
      </main>

      {/* Bottom navigation (claro, com acento verde) */}
      <footer
        className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[94%] max-w-xl rounded-2xl shadow-lg"
        style={{
          background: "#ffffff",
          border: "1px solid rgba(0,0,0,0.04)",
        }}
      >
        <nav className="flex items-center justify-between px-4 py-3">
          {navItems.map((item) => {
            const active = router.asPath === item.href;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className="flex flex-col items-center gap-1 text-[12px] transition"
                style={{
                  color: active ? success : muted,
                }}
              >
                <div
                  className={clsx("p-2 rounded-full")}
                  style={{
                    background: active ? `${success}1a` : "transparent",
                  }}
                >
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </footer>

      <style jsx>{`
        :root {
          --success: ${success};
          --muted: ${muted};
        }
      `}</style>
    </div>
  );
}
