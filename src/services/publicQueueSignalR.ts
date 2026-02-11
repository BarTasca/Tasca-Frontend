import * as signalR from '@microsoft/signalr'
import { API_BASE_URL } from '@/config'
import type { QueueAheadDto } from '@/types/queue'

let connection: signalR.HubConnection | null = null
let startPromise: Promise<void> | null = null

function buildPublicHubUrl(): string {
  const envUrl = (import.meta.env.VITE_SIGNALR_HUB_PUBLIC as string | undefined)?.trim()
  if (envUrl) return envUrl
  return `${API_BASE_URL.replace(/\/+$/, '')}/hubs/public-queue`
}

function createConnection(): signalR.HubConnection {
  const conn = new signalR.HubConnectionBuilder()
    .withUrl(buildPublicHubUrl(), {
      withCredentials: false,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build()

  conn.onclose((err) => {
    if (err) console.warn('[Public SignalR] closed:', err)
  })

  return conn
}

export async function ensurePublicConnected(): Promise<void> {
  if (!connection) {
    connection = createConnection()
  }

  if (
    connection.state === signalR.HubConnectionState.Connected ||
    connection.state === signalR.HubConnectionState.Connecting ||
    connection.state === signalR.HubConnectionState.Reconnecting
  ) {
    return
  }

  if (!startPromise) {
    startPromise = connection
      .start()
      .catch((err) => {
        startPromise = null
        throw err
      })
      .then(() => {
        startPromise = null
      })
  }

  await startPromise
}

export function onAheadUpdated(handler: (dto: QueueAheadDto) => void): void {
  if (!connection) throw new Error('[Public SignalR] not initialized')
  connection.on('aheadUpdated', handler as any)
}

export function offAheadUpdated(handler: (dto: QueueAheadDto) => void): void {
  if (!connection) return
  connection.off('aheadUpdated', handler as any)
}

export async function stopPublicSignalR(): Promise<void> {
  if (!connection) return
  try {
    await connection.stop()
  } catch {}
  connection = null
  startPromise = null
}
