import { apiFetch } from '../lib/http';
import { STORAGE_KEYS } from '../config';
import type { CreateTicketDto, TicketDetailDto, TicketStatusDto } from '../types/tickets';

export async function createTicket(data: CreateTicketDto): Promise<TicketDetailDto> {
  return apiFetch<TicketDetailDto>('/api/Tickets', { method: 'POST', json: data });
}

export interface TicketTokenResponse { token: string }

export async function createTicketToken(publicId: string): Promise<TicketTokenResponse> {
  return apiFetch<TicketTokenResponse>(`/api/Tickets/${publicId}/token`, {
    method: 'POST',
  });
}

export function persistTicketToken(token: string | null): void {
  if (token) localStorage.setItem(STORAGE_KEYS.ticketToken, token);
  else localStorage.removeItem(STORAGE_KEYS.ticketToken);
}

export async function getTicketStatus(publicId: string): Promise<TicketStatusDto> {
  return apiFetch<TicketStatusDto>(`/api/Tickets/${publicId}/status`, {
    auth: 'ticket',
  });
}


export interface TicketTokenResponse { token: string }

export function readJwtPayload(token: string | null): any | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    const json = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    try { return JSON.parse(atob(parts[1])); } catch { return null; }
  }
}

// 🔹 garantiza que el token de ticket es para ESTE publicId
export async function ensureTicketTokenFor(publicId: string): Promise<void> {
  const token = localStorage.getItem(STORAGE_KEYS.ticketToken);
  const payload = readJwtPayload(token);
  const claim = payload?.ticket_public_id ?? payload?.['ticket_public_id'];

  if (!token || !claim || claim !== publicId) {
    const res = await apiFetch<TicketTokenResponse>(`/api/tickets/${publicId}/token`, { method: 'POST' });
    localStorage.setItem(STORAGE_KEYS.ticketToken, res.token);
  }
}
