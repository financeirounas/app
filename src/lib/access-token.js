import cookie from "cookie";

export function getJwtTokenFromReq(req) {
  const cookies = cookie.parse(req.headers.cookie || "");
  return cookies.token || null;
}


export function setJwtToken(res, token) {
  const serialized = cookie.serialize("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  res.setHeader("Set-Cookie", serialized);
}
