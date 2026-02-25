import { apiFetch } from './api'
import type { ListResponse } from './lists.api'

export interface FriendResponse {
  id: string
  userId: string
  displayName: string
  email: string
  avatarUrl: string | null
  status: 'ACCEPTED' | 'PENDING'
}

export const friendKeys = {
  all:      () => ['friends']          as const,
  requests: () => ['friends', 'requests'] as const,
  lists:    () => ['friends', 'lists'] as const,
}

export const friendsApi = {
  getAll:      ()                  => apiFetch<FriendResponse[]>('/friends'),
  getRequests: ()                  => apiFetch<FriendResponse[]>('/friends/requests'),
  sendRequest: (email: string)     => apiFetch<FriendResponse>('/friends/request', { method: 'POST', body: { email } }),
  accept:      (id: string)        => apiFetch<FriendResponse>(`/friends/${id}/accept`, { method: 'PUT' }),
  remove:      (id: string)        => apiFetch<void>(`/friends/${id}`, { method: 'DELETE' }),
  getLists:    ()                  => apiFetch<(ListResponse & { owner: { displayName: string; avatarUrl: string | null } })[]>('/friends/lists'),
}
