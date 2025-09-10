import { defineStore } from 'pinia';
import { persistStaffToken } from '@/services/auth';
import type { LoginRequestDto, LoginResponseDto } from '@/types/auth';
import { staffLogin } from '@/services/auth';
import { STORAGE_KEYS } from '@/config';

type Role = string;

interface AuthState {
  token: string | null;
  role: Role | null;
  expiresAtUtc: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem(STORAGE_KEYS.staffToken),
    role: null,
    expiresAtUtc: null,
  }),
  getters: {
    isAuthenticated: (s) => !!s.token,
  },
  actions: {
    async login(payload: LoginRequestDto): Promise<LoginResponseDto> {
      const res = await staffLogin(payload);
      this.token = res.token;
      this.role = res.role ?? null;
      this.expiresAtUtc = res.expiresAtUtc ?? null;
      persistStaffToken(res.token);
      return res;
    },
    logout() {
      this.token = null;
      this.role = null;
      this.expiresAtUtc = null;
      persistStaffToken(null);
    },
  },
});
