import { API_BASE_URL, STORAGE_KEYS } from '@/config'

export class ApiError extends Error {
  status: number
  url: string
  body?: unknown
  constructor(message: string, status: number, url: string, body?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.url = url
    this.body = body
  }
}

type AuthKind = 'staff' | 'ticket'

type ApiInit = RequestInit & {
  auth?: AuthKind | false
  json?: unknown
}

function readToken(kind: AuthKind): string | null {
  const key = kind === 'staff' ? STORAGE_KEYS.staffToken : STORAGE_KEYS.ticketToken
  return localStorage.getItem(key)
}

export async function apiFetch<T>(path: string, init: ApiInit = {}): Promise<T> {
  const base = API_BASE_URL.replace(/\/+$/, '')
  const rel = `/${String(path).replace(/^\/+/, '')}`
  const url = path.startsWith('http') ? path : `${base}${rel}`

  const headers = new Headers(init.headers ?? {})
  if (!headers.has('Accept')) headers.set('Accept', 'application/json')
  if (init.json !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (init.auth) {
    const token = readToken(init.auth)
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(url, {
    ...init,
    method: init.method ?? (init.json !== undefined ? 'POST' : 'GET'),
    headers,
    body:
      init.json !== undefined
        ? JSON.stringify(init.json)
        : (init.body as BodyInit | null | undefined),
  })

  if (res.ok) {
    if (res.status === 204) return undefined as unknown as T
    const ct = res.headers.get('content-type') ?? ''
    if (ct.includes('application/json')) {
      return (await res.json()) as T
    }
    return (await res.text()) as unknown as T
  }

  const ct = res.headers.get('content-type') ?? ''
  let payload: unknown = undefined
  if (ct.includes('application/json')) {
    try {
      payload = await res.json()
    } catch {}
  }
  const msg =
    (payload as any)?.error ||
    (payload as any)?.message ||
    (payload as any)?.title ||
    `HTTP ${res.status}`

  throw new ApiError(msg, res.status, url, payload)
}
