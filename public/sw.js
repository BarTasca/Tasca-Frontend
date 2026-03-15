self.addEventListener('push', (event) => {
  console.log('[sw] push event received', event)

  let data = {
    title: 'Bar La Tasca',
    body: 'Tienes una actualización en tu turno.',
    url: '/',
    type: 'unknown',
  }

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() }
      console.log('[sw] push payload json', data)
    } catch (error) {
      try {
        const text = event.data.text()
        data = {
          ...data,
          body: text,
        }
        console.log('[sw] push payload text', text)
      } catch (textError) {
        console.error('[sw] failed to parse push payload', textError)
      }
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      data: { url: data.url, type: data.type },
      tag: `tasca-${data.type}`,
      renotify: true,
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  console.log('[sw] notification click', event)

  event.notification.close()

  const url = event.notification?.data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        try {
          const clientUrl = new URL(client.url)
          const targetUrl = new URL(url, self.location.origin)

          if (clientUrl.href === targetUrl.href && 'focus' in client) {
            return client.focus()
          }
        } catch {}
      }

      if (clients.openWindow) {
        return clients.openWindow(url)
      }

      return undefined
    }),
  )
})