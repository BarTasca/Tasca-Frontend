export interface CreateTicketDto {
  fullName: string;
  phone: string;
  peopleCount: number;
}

export interface TicketDetailDto {
  id: number;
  peopleCount: number;
  position: number;
  status: string;
  createdAt: string;
  notifiedAt?: string | null;
  confirmedAt?: string | null;
  expiresAt?: string | null;
  ahead: number;
  customerFullName: string;
}

export interface TicketStatusDto {
  publicId: string;
  status: string;
  ahead: number;
  position: number;
  peopleCount: number;
  createdAt: string;
  notifiedAt?: string | null;
}
