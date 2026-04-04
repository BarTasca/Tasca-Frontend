export interface CreateTicketDto {
  fullName: string
  phone: string
  peopleCount: number
  qrToken: string
}

export interface TicketDetailDto {
  id: number
  publicId: string
  peopleCount: number
  position: number
  status: string
  createdAt: string
  notifiedAt?: string | null
  confirmedAt?: string | null
  expiresAt?: string | null
  ahead: number
  customerFullName: string
}

export interface TicketStatusDto {
  publicId: string
  status: string
  ahead: number
  position: number
  peopleCount: number
  createdAt: string
  notifiedAt?: string | null
  customerFullName: string
}

export interface TicketTokenResponse {
  token: string
}
