import { apiFetch } from './api'

export interface ListResponse {
  id: string
  name: string
  description: string | null
  visibility: 'PRIVATE' | 'FRIENDS'
  itemCount: number
  createdAt: string
}

export interface ItemResponse {
  id: string
  title: string
  url: string
  description: string | null
  price: string | null
  imageUrl: string | null
  priority: 1 | 2 | 3
  note: string | null
  claim: { claimedByName: string } | null
  createdAt: string
}

export interface ListDetailResponse extends ListResponse {
  owner: { id: string; displayName: string; avatarUrl: string | null }
  items: ItemResponse[]
}

export interface CreateListDto {
  name: string
  description?: string
  visibility?: 'PRIVATE' | 'FRIENDS'
}

export interface UpdateListDto {
  name?: string
  description?: string
  visibility?: 'PRIVATE' | 'FRIENDS'
}

export const listKeys = {
  all:    ()           => ['lists']       as const,
  detail: (id: string) => ['lists', id]  as const,
}

export const listsApi = {
  getAll:  ()                                => apiFetch<ListResponse[]>('/lists'),
  getById: (id: string)                      => apiFetch<ListDetailResponse>(`/lists/${id}`),
  create:  (body: CreateListDto)             => apiFetch<ListResponse>('/lists', { method: 'POST', body }),
  update:  (id: string, body: UpdateListDto) => apiFetch<ListResponse>(`/lists/${id}`, { method: 'PUT', body }),
  remove:  (id: string)                      => apiFetch<void>(`/lists/${id}`, { method: 'DELETE' }),
}
