// src/proxy.js
import { NextResponse } from "next/server";

/**
 * Rotas públicas (suporta "/prefix/*" e "/prefix/")
 */
const PUBLIC_PATHS = [
  "/auth/*",
  "/api/auth/*",
  "/public/*",
  "/favicon.ico",
  "/_next/",
];

function isPublicPath(pathname) {
  for (const p of PUBLIC_PATHS) {
    if (p.endsWith("/*")) {
      const prefix = p.slice(0, -1); // "/auth/*" -> "/auth/"
      if (pathname.startsWith(prefix)) return true;
    } else if (p.endsWith("/")) {
      if (pathname.startsWith(p)) return true;
    } else {
      if (pathname === p) return true;
    }
  }
  return false;
}

async function validateToken(token) {
  if (!token) return null;
  try {
    const res = await fetch(`${process.env.SERVER_URL}/auth/validate-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json.payload ?? null;
  } catch (err) {
    return null;
  }
}

/**
 * IMPORTANT: Next.js v16 espera exatamente esta exportação named "proxy"
 * Este arquivo será executado para cada requisição que casar com matcher.
 */
export async function proxy(req) {
  // req.nextUrl tem o pathname e search
  const { pathname, search } = req.nextUrl;

  // permitir assets estáticos de imediato
  if (pathname.startsWith("/_next/") || pathname.startsWith("/static/") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  // pegar cookie 'token' usando a API do Request (Edge-safe)
  const cookie = req.cookies.get("token");
  const token = cookie ? cookie.value : null;

  const publicRoute = isPublicPath(pathname);

  if (publicRoute) {
    if (pathname === "/auth/logout") return NextResponse.next();

    if (token) {
      const payload = await validateToken(token);
      if (payload && payload.sub) {
        // já autenticado: redireciona pra raiz (ou mude conforme queira)
        return NextResponse.redirect(new URL("/", req.url));
      }
      // token inválido -> permitir rota pública (ex.: página de login)
      return NextResponse.next();
    }
    return NextResponse.next();
  }

  // rota protegida
  if (!token) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("returnTo", pathname + (search || ""));
    return NextResponse.redirect(loginUrl);
  }

  const payload = await validateToken(token);
  if (!payload || !payload.sub) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("returnTo", pathname + (search || ""));
    return NextResponse.redirect(loginUrl);
  }

  // token válido -> adicionar header x-user-id e seguir
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", String(payload.sub));

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// matcher para evitar verificar assets estáticos
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
