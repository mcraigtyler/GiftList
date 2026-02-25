import { apiFetch } from './api'

export interface InviteResponse {
  id: string
  listId: string
  listName: string
  ownerName: string
  status: 'PENDING' | 'ACCEPTED'
  createdAt: string
}

export const inviteKeys = {
  all: () => ['invites'] as const,
}

export const invitesApi = {
  getAll:  ()                        => apiFetch<InviteResponse[]>('/invites'),
  invite:  (listId: string, email: string) =>
    apiFetch<InviteResponse>(`/lists/${listId}/invites`, { method: 'POST', body: { email } }),
  revoke:  (listId: string, inviteId: string) =>
    apiFetch<void>(`/lists/${listId}/invites/${inviteId}`, { method: 'DELETE' }),
  accept:  (id: string) =>
    apiFetch<InviteResponse>(`/invites/${id}/accept`, { method: 'PUT' }),
}
