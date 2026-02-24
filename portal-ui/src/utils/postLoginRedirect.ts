const STORAGE_KEY = 'stillum.postLoginRedirect';

const DISALLOWED_BASE_PATHS = new Set(['/login', '/oidc/callback']);

export function getLocationTarget(location: {
  pathname: string;
  search: string;
  hash: string;
}): string {
  return `${location.pathname}${location.search}${location.hash}`;
}

export function sanitizeRedirectTo(value: string | null): string | null {
  if (!value) return null;
  if (!value.startsWith('/')) return null;
  if (value.startsWith('//')) return null;
  const basePath = value.split(/[?#]/)[0];
  if (DISALLOWED_BASE_PATHS.has(basePath)) return null;
  return value;
}

export function readPostLoginRedirect(): string | null {
  return sanitizeRedirectTo(window.sessionStorage.getItem(STORAGE_KEY));
}

export function setPostLoginRedirect(value: string | null): void {
  const sanitized = sanitizeRedirectTo(value);
  if (sanitized) {
    window.sessionStorage.setItem(STORAGE_KEY, sanitized);
    return;
  }
  window.sessionStorage.removeItem(STORAGE_KEY);
}

export function consumePostLoginRedirect(): string | null {
  const redirectTo = readPostLoginRedirect();
  window.sessionStorage.removeItem(STORAGE_KEY);
  return redirectTo;
}
