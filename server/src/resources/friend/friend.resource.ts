export interface FriendRequestDto {
  email: string
}

export interface FriendResponse {
  id: string
  userId: string
  displayName: string
  email: string
  avatarUrl: string | null
  status: 'ACCEPTED' | 'PENDING'
}

export interface FriendsListsResponse {
  id: string
  name: string
  description: string | null
  visibility: 'PRIVATE' | 'FRIENDS'
  itemCount: number
  createdAt: string
  owner: {
    id: string
    displayName: string
    avatarUrl: string | null
  }
}
