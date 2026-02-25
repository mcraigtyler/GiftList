export interface CreateInviteDto {
  email: string
}

export interface InviteResponse {
  id: string
  listId: string
  listName: string
  ownerName: string
  status: 'PENDING' | 'ACCEPTED'
  createdAt: string
}
