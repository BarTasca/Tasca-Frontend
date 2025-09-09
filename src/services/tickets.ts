import { apiFetch } from '../lib/http';
import { STORAGE_KEYS } from '../config';
import type { CreateTicketDto, TicketDetailDto, TicketStatusDto } from '../types/tickets';

export async function createTicket(data: CreateTicketDto): Promise<TicketDetailDto> {
  return apiFetch<TicketDetailDto>('/api/tickets', { method: 'POST', json: data });
}

export interface TicketTokenResponse { token: string }

export async function createTicketToken(publicId: string): Promise<TicketTokenResponse> {
  return apiFetch<TicketTokenResponse>(`/api/tickets/${encodeURIComponent(publicId)}/token`, {
    method: 'POST',
  });
}

export function persistTicketToken(token: string | null): void {
  if (token) localStorage.setItem(STORAGE_KEYS.ticketToken, token);
  else localStorage.removeItem(STORAGE_KEYS.ticketToken);
}

export async function getTicketStatus(publicId: string): Promise<TicketStatusDto> {
  // Requiere Authorization: Bearer (token de ticket) o token de staff
  return apiFetch<TicketStatusDto>(`/api/tickets/${encodeURIComponent(publicId)}/status`, {
    auth: 'ticket',
  });
}
