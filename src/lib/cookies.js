// lib/cookies.js
export function appendSetCookie(res, serializedCookie) {
  const prev = res.getHeader('Set-Cookie');

  if (!prev) {
    // nenhum cookie ainda definido
    res.setHeader('Set-Cookie', serializedCookie);
    return;
  }

  if (Array.isArray(prev)) {
    res.setHeader('Set-Cookie', [...prev, serializedCookie]);
    return;
  }

  // prev é string
  res.setHeader('Set-Cookie', [prev, serializedCookie]);
}
