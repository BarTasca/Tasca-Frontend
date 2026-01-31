import { apiFetch } from '@/lib/http'
import type { serviceStateDto } from '@/types/serviceState'

export interface UpdateServiceStateDto {
  isOpen: boolean
}

export interface SetOpenResponse {
  changed: boolean
  isOpen: boolean
}

export async function getServiceState(): Promise<serviceStateDto> {
  return apiFetch<serviceStateDto>('/api/ServiceState', { method: 'GET', auth: false })
}

export async function setServiceOpen(isOpen: boolean): Promise<SetOpenResponse> {
  return apiFetch<SetOpenResponse>('/api/ServiceState', {
    method: 'PUT',
    auth: 'staff',
    json: { isOpen } satisfies UpdateServiceStateDto,
  })
}
