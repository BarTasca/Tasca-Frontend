import { apiFetch } from '@/lib/http'

export interface VapidPublicKeyResponse {
  publicKey: string
}

export interface PushSubscriptionKeysDto {
  p256dh: string
  auth: string
}

export interface PushSubscriptionDto {
  endpoint: string
  keys: PushSubscriptionKeysDto
}

export interface RegisterPushSubscriptionRequest {
  ticketToken: string
  subscription: PushSubscriptionDto
}

export interface RegisterPushSubscriptionResponse {
  created: boolean
  updated: boolean
}

export interface UnregisterPushSubscriptionRequest {
  ticketToken: string
  endpoint: string
}

export async function getVapidPublicKey(): Promise<VapidPublicKeyResponse> {
  return apiFetch<VapidPublicKeyResponse>('/api/push/vapid-public-key', {
    method: 'GET',
    auth: false,
  })
}

export async function registerTicketPushSubscription(
  publicId: string,
  body: RegisterPushSubscriptionRequest,
): Promise<RegisterPushSubscriptionResponse> {
  return apiFetch<RegisterPushSubscriptionResponse>(
    `/api/tickets/${encodeURIComponent(publicId)}/push-subscriptions`,
    {
      method: 'POST',
      auth: 'ticket',
      json: body,
    },
  )
}

export async function unregisterTicketPushSubscription(
  publicId: string,
  body: UnregisterPushSubscriptionRequest,
): Promise<void> {
  return apiFetch<void>(
    `/api/tickets/${encodeURIComponent(publicId)}/push-subscriptions`,
    {
      method: 'DELETE',
      auth: 'ticket',
      json: body,
    },
  )
}