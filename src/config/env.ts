export const isDev = import.meta.env.DEV === true

export const isStaging =
  (import.meta.env.VITE_APP_ENV as string | undefined) === 'staging'

export const isDevPreviewEnabled = isDev || isStaging