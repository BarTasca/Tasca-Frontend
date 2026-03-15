import { isDevPreviewEnabled } from '@/config/env'

export function readDevContext(): {
  enabled: boolean
  scenario: string | null
} {
  if (!isDevPreviewEnabled) return { enabled: false, scenario: null }

  const params = new URLSearchParams(window.location.search)
  const dev = params.get('dev')
  const scenario = params.get('scenario')

  return {
    enabled: dev === '1',
    scenario,
  }
}