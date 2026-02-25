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

export interface OgScrapeDto {
  url: string
}

export interface OgScrapeResult {
  title: string | null
  description: string | null
  imageUrl: string | null
  price: string | null
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
