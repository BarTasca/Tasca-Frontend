export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';

if (!API_BASE_URL) {
  console.warn('[config] VITE_API_BASE_URL no está configurada');
}

// Claves de almacenamiento local para tokens
export const STORAGE_KEYS = {
  staffToken: 'auth.staff.token',
  ticketToken: 'auth.ticket.token',
} as const;
