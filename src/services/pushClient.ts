const SW_URL = '/sw.js'

export type PushUnsupportedReason =
  | 'not-in-browser'
  | 'insecure-context'
  | 'missing-notification-api'
  | 'missing-service-worker-api'
  | 'missing-push-manager'
  | 'ios-home-screen-required'

export interface PushSupportStatus {
  supported: boolean
  reason: PushUnsupportedReason | null
}

function isLocalhost(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]'
}

function isTrustedContext(): boolean {
  if (typeof window === 'undefined') return false
  return window.isSecureContext || isLocalhost(window.location.hostname)
}

function isIosLikeDevice(): boolean {
  if (typeof navigator === 'undefined') return false
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

function isStandaloneDisplayMode(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(display-mode: standalone)')?.matches === true ||
    // Safari legacy property for installed web apps
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
}

export function getPushSupportStatus(): PushSupportStatus {
  if (typeof window === 'undefined') {
    return { supported: false, reason: 'not-in-browser' }
  }

  if (!isTrustedContext()) {
    return { supported: false, reason: 'insecure-context' }
  }

  if (!('Notification' in window)) {
    return { supported: false, reason: 'missing-notification-api' }
  }

  if (!('serviceWorker' in navigator)) {
    return { supported: false, reason: 'missing-service-worker-api' }
  }

  if (!('PushManager' in window)) {
    if (isIosLikeDevice() && !isStandaloneDisplayMode()) {
      return { supported: false, reason: 'ios-home-screen-required' }
    }

    return { supported: false, reason: 'missing-push-manager' }
  }

  return { supported: true, reason: null }
}

export function getPushUnsupportedReasonMessage(reason: PushUnsupportedReason | null): string {
  switch (reason) {
    case 'ios-home-screen-required':
      return 'En iPhone/iPad, Safari solo permite notificaciones push si abres la app web desde la pantalla de inicio.'
    case 'insecure-context':
      return 'Las notificaciones push requieren HTTPS (o localhost en desarrollo).'
    case 'missing-notification-api':
    case 'missing-service-worker-api':
    case 'missing-push-manager':
      return 'Este navegador no soporta notificaciones push.'
    case 'not-in-browser':
    default:
      return 'No se pueden activar notificaciones en este entorno.'
  }
}

export async function registerPushServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined') return null
  if (!('serviceWorker' in navigator)) return null
  if (!isTrustedContext()) return null

  try {
    const registration = await navigator.serviceWorker.register(SW_URL)
    return registration
  } catch (error) {
    console.error('[push] service worker registration failed', error)
    return null
  }
}

export function isPushSupported(): boolean {
  return getPushSupportStatus().supported
}

export function getNotificationPermission(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'denied'
  return Notification.permission
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'denied'
  return Notification.requestPermission()
}

export async function getPushRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined') return null
  if (!('serviceWorker' in navigator)) return null

  try {
    return await navigator.serviceWorker.ready
  } catch {
    return null
  }
}

export async function getExistingBrowserPushSubscription(): Promise<PushSubscription | null> {
  const registration = await getPushRegistration()
  if (!registration) return null

  return registration.pushManager.getSubscription()
}

export async function unsubscribeBrowserPush(): Promise<boolean> {
  const subscription = await getExistingBrowserPushSubscription()
  if (!subscription) return false

  return subscription.unsubscribe()
}

export async function subscribeBrowserPush(vapidPublicKey: string): Promise<PushSubscription> {
  const registration = await getPushRegistration()
  if (!registration) {
    throw new Error('Service worker not ready')
  }

  const existing = await registration.pushManager.getSubscription()
  if (existing) return existing

  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: base64UrlToUint8Array(vapidPublicKey) as BufferSource,
  })
}

function base64UrlToUint8Array(base64Url: string): Uint8Array {
  const padding = '='.repeat((4 - (base64Url.length % 4)) % 4)
  const base64 = (base64Url + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = window.atob(base64)
  const output = new Uint8Array(raw.length)

  for (let i = 0; i < raw.length; ++i) {
    output[i] = raw.charCodeAt(i)
  }

  return output
}