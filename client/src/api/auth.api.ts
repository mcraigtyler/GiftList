import { apiFetch } from './api'

interface LoginDto {
  email: string
  password: string
}

interface RegisterDto {
  email: string
  password: string
  displayName: string
}

interface UserResponse {
  id: string
  email: string
  displayName: string
  avatarUrl: string | null
}

export const authApi = {
  register: (body: RegisterDto) =>
    apiFetch<UserResponse>('/auth/register', { method: 'POST', body }),

  login: (body: LoginDto) =>
    apiFetch<UserResponse>('/auth/login', { method: 'POST', body }),

  logout: () =>
    apiFetch<void>('/auth/logout', { method: 'POST' }),

  me: () =>
    apiFetch<UserResponse>('/auth/me'),
}
