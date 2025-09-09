import { apiFetch } from '../lib/http';
import { STORAGE_KEYS } from '../config';
import type { LoginRequestDto, LoginResponseDto } from '../types/auth';

export async function staffLogin(data: LoginRequestDto): Promise<LoginResponseDto> {
  const res = await apiFetch<LoginResponseDto>('/api/auth/login', {
    method: 'POST',
    json: data,
  });
  return res;
}

export function persistStaffToken(token: string | null): void {
  if (token) localStorage.setItem(STORAGE_KEYS.staffToken, token);
  else localStorage.removeItem(STORAGE_KEYS.staffToken);
}
