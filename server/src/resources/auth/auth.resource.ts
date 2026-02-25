export interface RegisterDto {
  email: string
  password: string
  displayName: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface AuthResponse {
  id: string
  email: string
  displayName: string
  avatarUrl: string | null
}
