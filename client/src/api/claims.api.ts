import { apiFetch } from './api'

export interface ClaimResponse {
  id: string
  itemId: string
  itemTitle: string
  listId: string
  listName: string
  ownerName: string
  claimedAt: string
}

export const claimKeys = {
  all: () => ['claims'] as const,
}

export const claimsApi = {
  getMyClaims: ()           => apiFetch<ClaimResponse[]>('/claims'),
  claim:       (itemId: string) => apiFetch<ClaimResponse>(`/items/${itemId}/claim`, { method: 'POST' }),
  unclaim:     (itemId: string) => apiFetch<void>(`/items/${itemId}/claim`, { method: 'DELETE' }),
}
