import { apiFetch } from './api'
import type { ItemResponse } from './lists.api'

export interface CreateItemDto {
  url: string
  title?: string
  description?: string
  price?: string
  imageUrl?: string
  priority?: 1 | 2 | 3
  note?: string
}

export interface UpdateItemDto {
  title?: string
  description?: string
  price?: string
  imageUrl?: string
  priority?: 1 | 2 | 3
  note?: string
}

export interface OgScrapeResult {
  title: string | null
  description: string | null
  imageUrl: string | null
  price: string | null
}

export const itemKeys = {
  byList: (listId: string) => ['lists', listId, 'items'] as const,
}

export const itemsApi = {
  create:  (listId: string, body: CreateItemDto) =>
    apiFetch<ItemResponse>(`/lists/${listId}/items`, { method: 'POST', body }),

  update:  (id: string, body: UpdateItemDto) =>
    apiFetch<ItemResponse>(`/items/${id}`, { method: 'PUT', body }),

  remove:  (id: string) =>
    apiFetch<void>(`/items/${id}`, { method: 'DELETE' }),

  scrapeOg: (url: string) =>
    apiFetch<OgScrapeResult>('/og-scrape', { method: 'POST', body: { url } }),
}
