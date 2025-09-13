import * as signalR from '@microsoft/signalr';
import { STORAGE_KEYS, API_BASE_URL } from '@/config';

type AuthKind = 'staff' | 'ticket';

let connection: signalR.HubConnection | null = null;
let startPromise: Promise<void> | null = null;
let currentKind: AuthKind | null = null;

// callbacks para re-entrar en grupos tras reconectar
const rejoinCallbacks = new Set<() => Promise<void> | void>();

function readToken(kind: AuthKind): string | null {
  if (kind === 'ticket') return localStorage.getItem(STORAGE_KEYS.ticketToken);
  return localStorage.getItem(STORAGE_KEYS.staffToken);
}

export function buildHubUrl(): string {
  const envUrl = (import.meta.env.VITE_SIGNALR_HUB_TICKETS as string | undefined)?.trim();
  if (envUrl) return envUrl;
  return `${API_BASE_URL.replace(/\/+$/, '')}/hubs/queue`;
}

function createConnection(kind: AuthKind): signalR.HubConnection {
  const conn = new signalR.HubConnectionBuilder()
    .withUrl(buildHubUrl(), {
      accessTokenFactory: () => readToken(kind) ?? '',
      withCredentials: false, // no cookies; evitamos CORS con credenciales
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  conn.onreconnected(async () => {
    for (const cb of rejoinCallbacks) {
      try { await cb(); } catch {}
    }
  });

  conn.onclose((err) => {
    // al cerrar, no cambiamos currentKind (lo conserva para posible restart)
    if (err) console.warn('[SignalR] closed:', err);
  });

  return conn;
}

/**
 * Garantiza que la conexión existe y está autenticada con el tipo de token indicado.
 * Si el tipo actual es distinto, detiene y recrea la conexión con el token correcto.
 */
export async function ensureAuth(kind: AuthKind): Promise<void> {
  // Si no hay token del tipo solicitado, no arrancamos (evita 401 en bucle)
  const token = readToken(kind);
  if (!token) throw new Error(`[SignalR] missing ${kind} token`);

  // ¿Hay que recrear?
  if (!connection || currentKind !== kind) {
    if (connection) {
      try { await connection.stop(); } catch {}
      connection = null;
      startPromise = null;
    }
    connection = createConnection(kind);
    currentKind = kind;
  }

  // Arranque single-flight
  if (connection.state === signalR.HubConnectionState.Connected ||
      connection.state === signalR.HubConnectionState.Connecting ||
      connection.state === signalR.HubConnectionState.Reconnecting) {
    return;
  }

  if (!startPromise) {
    startPromise = connection.start()
      .catch(err => { startPromise = null; throw err; })
      .then(() => { startPromise = null; });
  }
  await startPromise;
}

export function on(eventName: string, handler: (payload: any) => void): void {
  if (!connection) throw new Error('SignalR connection not initialized');
  connection.on(eventName, handler);
}

export function off(eventName: string, handler: (payload: any) => void): void {
  if (!connection) return;
  connection.off(eventName, handler);
}

export async function stop(): Promise<void> {
  if (!connection) return;
  try { await connection.stop(); } catch {}
  connection = null;
  startPromise = null;
  currentKind = null;
}

/** Registra múltiples eventos leídos de VITE_SIGNALR_TICKET_EVENTS (csv). */
export function registerTicketEventHandlers(handler: (payload: any) => void): () => void {
  const csv = (import.meta.env.VITE_SIGNALR_TICKET_EVENTS as string | undefined) ?? '';
  const events = csv.split(',').map(s => s.trim()).filter(Boolean);
  const bound: Array<{ name: string; fn: (payload: any) => void }> = [];
  for (const ev of events) {
    on(ev, handler);
    bound.push({ name: ev, fn: handler });
  }
  return () => {
    for (const { name, fn } of bound) off(name, fn);
  };
}

// ---- grupos del Hub ----

export async function joinStaffGroup(): Promise<void> {
  await ensureAuth('staff');
  if (!connection) throw new Error('SignalR connection not ready');
  await connection.invoke('JoinStaff'); // requiere Policy=Staff

  // rejoin
  rejoinCallbacks.add(async () => { try { await connection?.invoke('JoinStaff'); } catch {} });
}

export async function joinTicketGroup(publicId: string): Promise<void> {
  await ensureAuth('ticket');

  if (!connection) throw new Error('SignalR connection not ready');

  // Reintentos progresivos SOLO para NotFound (posible carrera al crear/consultar)
  let lastErr: any = null;
  for (let i = 0; i < 5; i++) {
    try {
      await connection.invoke('JoinTicketGroup', publicId);
      // rejoin tras reconexión
      const pid = publicId;
      rejoinCallbacks.add(async () => { try { await connection?.invoke('JoinTicketGroup', pid); } catch {} });
      return;
    } catch (err: any) {
      lastErr = err;
      const msg = String(err?.message ?? '');
      // Si el servidor indica NotFound, espera y reintenta
      if (msg.includes('NotFound') || msg.toLowerCase().includes('not found')) {
        await new Promise(r => setTimeout(r, 150 * (i + 1)));
        continue;
      }
      // Otros errores (Forbidden/Unauthorized/etc.) -> no reintentes
      console.error('[SignalR] joinTicketGroup failed (non-retryable)', { publicId, err });
      throw err;
    }
  }
  console.error('[SignalR] joinTicketGroup failed after retries', { publicId, err: lastErr });
  throw lastErr ?? new Error('JoinTicketGroup failed');
}
