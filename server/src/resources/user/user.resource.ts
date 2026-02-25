export interface UserResponse {
  id: string
  email: string
  displayName: string
  avatarUrl: string | null
}

export interface UpdateProfileDto {
  displayName?: string
  avatarUrl?: string
}
