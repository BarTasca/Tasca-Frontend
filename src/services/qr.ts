import { apiFetch } from '@/lib/http'
import type { QrTokenDto } from '@/types/qr'

export async function getCurrentQrToken(): Promise<QrTokenDto> {
  return apiFetch<QrTokenDto>('/api/Qr/current', { method: 'GET' })
}
