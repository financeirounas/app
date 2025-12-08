import { NextResponse } from "next/server";

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
      const prefix = p.slice(0, -1);
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


export async function proxy(req) {
  
  const { pathname, search } = req.nextUrl;

  
  if (pathname.startsWith("/_next/") || pathname.startsWith("/static/") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  
  const cookie = req.cookies.get("token");
  const token = cookie ? cookie.value : null;
  const userIdCookie = req.cookies.get("user-id");
  const userId = userIdCookie ? userIdCookie.value : null;

  const publicRoute = isPublicPath(pathname);

  if (publicRoute) {
    if (pathname === "/api/auth/logout") return NextResponse.next();

    if (token) {
      const payload = await validateToken(token);
      if (payload && payload.sub && payload.sub === userId) {
  
        return NextResponse.redirect(new URL("/", req.url));
      }
  
      return NextResponse.next();
    }
    return NextResponse.next();
  }

  
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

  
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", String(payload.sub));

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}


export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
