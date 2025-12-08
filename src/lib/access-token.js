// lib/access-token.js
import cookie from 'cookie';
import { appendSetCookie } from './cookies';

export function getJwtTokenFromReq(req) {
  const cookies = cookie.parse(req.headers.cookie || '');
  return cookies.token || null;
}

export function setJwtToken(res, token, maxAge = 60 * 60 * 24 * 7) {
  const serialized = cookie.serialize('token', String(token), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge,
  });

  appendSetCookie(res, serialized);
}

export function clearJwtToken(res) {
  appendSetCookie(res, cookie.serialize('token', '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
  }));
}
