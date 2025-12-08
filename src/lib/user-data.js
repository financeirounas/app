
import cookie from 'cookie';
import { appendSetCookie } from './cookies';

export function setUserId(res, user, maxAge = 60 * 60 * 24 * 365) {
  const serialized = cookie.serialize('user-id', String(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });

  appendSetCookie(res, serialized);
}

export function getUserId(req) {
  const cookies = req.headers.cookie;
  if (!cookies) return null;
  const parsed = cookie.parse(cookies);
  var user_id = parsed['user-id'];
  return user_id || null;
}

export function clearUserId(res) {
  appendSetCookie(res, cookie.serialize('user-id', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
  }));
}
