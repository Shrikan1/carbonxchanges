// backend/utils/cookieOptions.js
/**
 * Generates secure, compatible cookie options for refresh tokens.
 * Handles both local development (HTTP localhost) and production (HTTPS / cross-origin subdomains).
 */
function getRefreshCookieOptions(req) {
  const isHttps = Boolean(
    req?.secure ||
    req?.headers?.['x-forwarded-proto'] === 'https' ||
    req?.headers?.referer?.startsWith('https://')
  );

  const isLocalhost = Boolean(
    req?.headers?.host?.includes('localhost') ||
    req?.headers?.host?.includes('127.0.0.1')
  );

  // In production over HTTPS or behind reverse proxy, use secure + sameSite: 'none'
  // for reliable cross-origin cookie delivery (e.g., Vercel frontend <-> backend API).
  // For local HTTP development, use secure: false + sameSite: 'lax'.
  const useSecure = isHttps || (!isLocalhost && process.env.NODE_ENV === 'production');

  return {
    httpOnly: true,
    secure: useSecure,
    sameSite: useSecure ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/',
  };
}

module.exports = { getRefreshCookieOptions };
