import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from '../api/auth.api'

interface User {
  id: string
  email: string
  displayName: string
  avatarUrl: string | null
}

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string, displayName: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    authApi.me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, [])

  async function login(email: string, password: string) {
    const u = await authApi.login({ email, password })
    setUser(u)
  }

  async function logout() {
    await authApi.logout()
    setUser(null)
  }

  async function register(email: string, password: string, displayName: string) {
    const u = await authApi.register({ email, password, displayName })
    setUser(u)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
