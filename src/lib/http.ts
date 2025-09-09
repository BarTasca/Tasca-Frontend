import { API_BASE_URL, STORAGE_KEYS } from '../config';

export class ApiError extends Error {
  status: number;
  url: string;
  body?: unknown;
  constructor(message: string, status: number, url: string, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.url = url;
    this.body = body;
  }
}

type AuthKind = 'staff' | 'ticket';

type ApiInit = RequestInit & {
  auth?: AuthKind | false;
  json?: unknown;
};

function readToken(kind: AuthKind): string | null {
  const key = kind === 'staff' ? STORAGE_KEYS.staffToken : STORAGE_KEYS.ticketToken;
  return localStorage.getItem(key);
}

export async function apiFetch<T>(path: string, init: ApiInit = {}): Promise<T> {
  const base = API_BASE_URL.replace(/\/+$/, '');
  const url = `${base}${path.startsWith('/') ? '' : '/'}${path}`;

  const headers = new Headers(init.headers ?? {});
  if (init.json !== undefined) headers.set('Content-Type', 'application/json');

  if (init.auth) {
    const token = readToken(init.auth);
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...init,
    headers,
    body:
      init.json !== undefined
        ? JSON.stringify(init.json)
        : (init.body as BodyInit | null | undefined),
  });

  const isJson = (res.headers.get('content-type') ?? '').includes('application/json');
  const payload = isJson ? await res.json().catch(() => undefined) : undefined;

  if (!res.ok) {
    const message = (payload as any)?.error || (payload as any)?.message || `HTTP ${res.status}`;
    throw new ApiError(message, res.status, url, payload);
  }

  return (payload as T) ?? (undefined as T);
}
