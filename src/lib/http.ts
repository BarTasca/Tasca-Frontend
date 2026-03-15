import { API_BASE_URL, STORAGE_KEYS } from '@/config'
import { readDevContext } from '@/dev/context'

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

  const dev = readDevContext()
  if (dev.enabled) {
    const mocked = devMock<T>(path, dev.scenario)
    if (mocked !== undefined) return mocked
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

function devMock<T>(path: string, scenario: string | null): T | undefined {
  // ---- TicketJoin submit mocks ----
  if (path.includes('/api/ServiceState')) {
    if (scenario === 'service_closed' || scenario === 'submit_error_closed') {
      return { isOpen: false, updatedAt: new Date().toISOString() } as T
    }
    return { isOpen: true, updatedAt: new Date().toISOString() } as T
  }

  if (path.includes('/api/Qr/validate')) {
    if (scenario === 'qr_expired' || scenario === 'submit_error_qr') {
      throw new ApiError('QR expired', 410, path, { code: 'QR_EXPIRED' })
    }
    return {} as T
  }

  if (path.includes('/api/Tickets/ahead')) {
    if (scenario === 'ahead_0') return { isOpen: true, ahead: 0 } as T
    if (scenario === 'ahead_3') return { isOpen: true, ahead: 3 } as T
    return { isOpen: true, ahead: 2 } as T
  }

  // POST /api/Tickets (crear ticket)
  if (path === '/api/Tickets') {
    if (scenario === 'submit_error_closed') {
      throw new ApiError('Service closed', 409, path, { code: 'SERVICE_CLOSED' })
    }
    if (scenario === 'submit_error_qr') {
      throw new ApiError('QR expired', 410, path, { code: 'QR_EXPIRED' })
    }
    if (scenario === 'submit_error_generic') {
      throw new ApiError('Mock error creating ticket', 500, path, { code: 'MOCK_ERROR' })
    }

    const publicId = `DEV-${Math.random().toString(16).slice(2, 10)}`
    const now = new Date().toISOString()

    return {
      id: 1,
      publicId,
      peopleCount: 2,
      position: 5,
      status: 'CREATED',
      createdAt: now,
      ahead: 4,
      customerFullName: 'Dev Preview',
      notifiedAt: null,
      confirmedAt: null,
      expiresAt: null,
    } as T
  }

  // POST /api/Tickets/{publicId}/token (crear token)
  if (/^\/api\/Tickets\/[^/]+\/token$/.test(path)) {
    return {
      token: 'DEV.TICKET.TOKEN',
    } as T
  }

  // GET /api/Tickets/{publicId}/status
  if (/^\/api\/Tickets\/[^/]+\/status$/.test(path)) {
    const publicId = path.split('/')[3] ?? 'DEV'

    const now = new Date().toISOString()

    const s = scenario ?? 'waiting'

    const map: Record<
      string,
      { status: string; ahead: number; position: number; notifiedAt?: string | null }
    > = {
      waiting: { status: 'WAITING', ahead: 3, position: 4 },
      notified: { status: 'NOTIFIED', ahead: 0, position: 1, notifiedAt: now },
      confirmed: { status: 'CONFIRMED', ahead: 0, position: 1 },
      served: { status: 'SERVED', ahead: 0, position: 0 },
      cancelled: { status: 'CANCELLED', ahead: 0, position: 0 },
      expired: { status: 'EXPIRED', ahead: 0, position: 0 },
      error: { status: 'WAITING', ahead: 3, position: 4 },
      loading: { status: 'WAITING', ahead: 3, position: 4 },
      cancel_success: { status: 'CANCELLED', ahead: 0, position: 0 },
    }

    if (s === 'error') {
      throw new ApiError('Mock error loading ticket status', 500, path, { code: 'MOCK_ERROR' })
    }

    const base = map[s] ?? map.waiting

    return {
      publicId,
      status: base.status,
      ahead: base.ahead,
      position: base.position,
      peopleCount: 2,
      createdAt: now,
      notifiedAt: base.notifiedAt ?? null,
    } as T
  }

  // POST /api/Tickets/{publicId}/cancel
  if (/^\/api\/Tickets\/[^/]+\/cancel$/.test(path)) {
    if (scenario === 'cancel_error') {
      throw new ApiError('Mock error cancelling ticket', 500, path, { code: 'MOCK_ERROR' })
    }

    const publicId = path.split('/')[3] ?? 'DEV'
    const now = new Date().toISOString()

    return {
      id: 1,
      publicId,
      peopleCount: 2,
      position: 0,
      status: 'CANCELLED',
      createdAt: now,
      ahead: 0,
      customerFullName: 'Dev Preview',
      notifiedAt: null,
      confirmedAt: null,
      expiresAt: null,
    } as T
  }

  if (/^\/api\/Tickets\/[^/]+\/status$/.test(path)) {
    const publicId = path.split('/')[3] ?? 'DEV'
    const now = new Date().toISOString()

    const s = scenario ?? 'waiting'

    const map: Record<
      string,
      { status: string; ahead: number; position: number; notifiedAt?: string | null }
    > = {
      waiting: { status: 'WAITING', ahead: 3, position: 4 },
      notified: { status: 'NOTIFIED', ahead: 0, position: 1, notifiedAt: now },
      confirmed: { status: 'CONFIRMED', ahead: 0, position: 1 },
      served: { status: 'SERVED', ahead: 0, position: 0 },
      cancelled: { status: 'CANCELLED', ahead: 0, position: 0 },
      expired: { status: 'EXPIRED', ahead: 0, position: 0 },

      // mini-mejora: preset para ver "tras cancelar"
      cancel_success: { status: 'CANCELLED', ahead: 0, position: 0 },

      // otros
      cancel_error: { status: 'WAITING', ahead: 2, position: 3 },
      error: { status: 'WAITING', ahead: 3, position: 4 },
    }

    if (s === 'error') {
      throw new ApiError('Mock error loading ticket status', 500, path, { code: 'MOCK_ERROR' })
    }

    const base = map[s] ?? map.waiting

    return {
      publicId,
      status: base.status,
      ahead: base.ahead,
      position: base.position,
      peopleCount: 2,
      createdAt: now,
      notifiedAt: base.notifiedAt ?? null,
    } as T
  }

    // ---- Auth (Login) mocks ----

  if (path === '/api/auth/login') {
    if (scenario === 'login_error') {
      throw new ApiError('Credenciales inválidas', 401, path, { code: 'INVALID_CREDENTIALS' })
    }

    if (scenario === 'login_error_server') {
      throw new ApiError('Mock error login', 500, path, { code: 'MOCK_ERROR' })
    }

    const now = new Date()
    const expires = new Date(now.getTime() + 60 * 60 * 1000).toISOString() // +1h

    return {
      token: 'DEV.STAFF.TOKEN',
      role: 'Staff',
      expiresAtUtc: expires,
    } as T
  }

    // ---- Staff tickets mocks ----

  if (path === '/api/staff/tickets') {
    if (scenario === 'staff_loading') {
      return [] as T
    }

    if (scenario === 'staff_error') {
      throw new ApiError('Mock error loading staff tickets', 500, path, { code: 'MOCK_ERROR' })
    }

    if (scenario === 'staff_empty') {
      return [] as T
    }

    const now = new Date().toISOString()

    return [
      {
        id: 101,
        peopleCount: 2,
        position: 1,
        status: 'WAITING',
        createdAt: now,
        customerFullName: 'Ana Pérez',
      },
      {
        id: 102,
        peopleCount: 4,
        position: 2,
        status: 'NOTIFIED',
        createdAt: now,
        customerFullName: 'Carlos Gómez',
      },
      {
        id: 103,
        peopleCount: 1,
        position: 3,
        status: 'WAITING',
        createdAt: now,
        customerFullName: 'Lucía Martín',
      },
      {
        id: 104,
        peopleCount: 3,
        position: 4,
        status: 'CONFIRMED',
        createdAt: now,
        customerFullName: 'Mario Ruiz',
      },
    ] as T
  }

  if (/^\/api\/staff\/tickets\/\d+\/serve$/.test(path)) {
    if (scenario === 'staff_action_error') {
      throw new ApiError('Mock error serving ticket', 500, path, { code: 'MOCK_ERROR' })
    }
    return undefined as unknown as T
  }

  if (/^\/api\/staff\/tickets\/\d+\/skip$/.test(path)) {
    if (scenario === 'staff_action_error') {
      throw new ApiError('Mock error skipping ticket', 500, path, { code: 'MOCK_ERROR' })
    }
    return undefined as unknown as T
  }

  if (/^\/api\/staff\/tickets\/\d+\/cancel$/.test(path)) {
    if (scenario === 'staff_action_error') {
      throw new ApiError('Mock error cancelling ticket', 500, path, { code: 'MOCK_ERROR' })
    }
    return undefined as unknown as T
  }

  if (/^\/api\/staff\/tickets\/\d+\/notify\?/.test(path)) {
    if (scenario === 'staff_action_error') {
      throw new ApiError('Mock error notifying ticket', 500, path, { code: 'MOCK_ERROR' })
    }
    return undefined as unknown as T
  }

    // ---- ServiceState mocks (staff + client) ----

  if (path === '/api/ServiceState') {
    // GET
    if (scenario === 'service_error') {
      throw new ApiError('Mock error loading service state', 500, path, { code: 'MOCK_ERROR' })
    }

    if (scenario === 'service_closed') {
      return { isOpen: false, updatedAt: new Date().toISOString() } as T
    }

    // por defecto abierto
    return { isOpen: true, updatedAt: new Date().toISOString() } as T
  }

  // PUT /api/ServiceState
  // Nota: en apiFetch el path es el mismo; distinguimos por scenario (suficiente para preview)
  if (path === '/api/ServiceState' && scenario === 'service_set_error') {
    throw new ApiError('Mock error setting service state', 500, path, { code: 'MOCK_ERROR' })
  }

  if (path === '/api/ServiceState' && scenario === 'service_set_ok') {
    // devolvemos "changed" true y el estado que toque.
    // No leemos body aquí para no acoplar, pero para estilos basta.
    return { changed: true, isOpen: true } as T
  }

  return undefined
}
