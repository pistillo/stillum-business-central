import { config } from '../config';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(
  url: string,
  opts: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const headers = new Headers(opts.headers);
  headers.set('Accept', 'application/json');
  if (opts.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (opts.token) {
    headers.set('Authorization', `Bearer ${opts.token}`);
  }

  const res = await fetch(url, { ...opts, headers });
  if (!res.ok) {
    let payload: unknown = null;
    try {
      payload = await res.json();
    } catch {
      // ignore JSON parse error, use status text as message
    }
    const err = payload as { error?: string } | null;
    const message = typeof err?.error === 'string' ? err.error : `${res.status} ${res.statusText}`;
    throw new ApiError(res.status, message);
  }
  return (await res.json()) as T;
}

export function registryUrl(path: string): string {
  return joinUrl(config.registryApiBaseUrl, path);
}

export function publisherUrl(path: string): string {
  return joinUrl(config.publisherApiBaseUrl, path);
}

function joinUrl(base: string, path: string): string {
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}
