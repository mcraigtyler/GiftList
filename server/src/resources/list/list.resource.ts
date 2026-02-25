import { ItemResponse } from '../item/item.resource'

export { ItemResponse }

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

export interface ListResponse {
  id: string
  name: string
  description: string | null
  visibility: 'PRIVATE' | 'FRIENDS'
  itemCount: number
  createdAt: string
}

export interface ListDetailResponse extends ListResponse {
  owner: {
    id: string
    displayName: string
    avatarUrl: string | null
  }
  items: ItemResponse[]
}
