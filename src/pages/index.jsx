import { useEffect } from "react";
export default function Home() {

  useEffect(() => {
    window.location.href = "/auth/login";
  }, []);

  return (
    <main>
      redirecionar para pagina de login
    </main>
  );
}
