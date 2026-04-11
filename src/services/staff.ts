import { apiFetch } from '../lib/http';
import type { TicketStaffListDto } from '../types/staff';

export async function listStaffTickets(): Promise<TicketStaffListDto[]> {
  return apiFetch<TicketStaffListDto[]>('/api/staff/tickets', { auth: 'staff' });
}

export async function serveTicket(id: number): Promise<void> {
  await apiFetch<void>(`/api/staff/tickets/${id}/serve`, { method: 'POST', auth: 'staff' });
}

export async function skipTicket(id: number): Promise<void> {
  await apiFetch<void>(`/api/staff/tickets/${id}/skip`, { method: 'POST', auth: 'staff' });
}

export async function cancelTicket(id: number): Promise<void> {
  await apiFetch<void>(`/api/staff/tickets/${id}/cancel`, { method: 'POST', auth: 'staff' });
}

export async function notifyTicket(id: number, force = true): Promise<void> {
  const q = new URLSearchParams({ force: String(force) });
  await apiFetch<void>(`/api/staff/tickets/${id}/notify?${q.toString()}`, {
    method: 'POST',
    auth: 'staff',
  });
}

export async function updateTicketPeopleCount(id: number, peopleCount: number): Promise<void> {
  await apiFetch<void>(`/api/staff/tickets/${id}`, {
    method: 'PUT',
    auth: 'staff',
    json: { peopleCount },
  })
}
