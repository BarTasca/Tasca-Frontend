const SW_URL = '/sw.js'

export async function registerPushServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null

  try {
    const registration = await navigator.serviceWorker.register(SW_URL)
    return registration
  } catch (error) {
    console.error('[push] service worker registration failed', error)
    return null
  }
}

export function isPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

export function getNotificationPermission(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'denied'
  return Notification.permission
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied'
  return Notification.requestPermission()
}

export async function getPushRegistration(): Promise<ServiceWorkerRegistration | null> {
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

  console.log('[push] subscribing with vapid key', vapidPublicKey)

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
