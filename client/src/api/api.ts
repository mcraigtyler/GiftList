const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001'

interface FetchOptions {
  method?: string
  body?: unknown
  headers?: Record<string, string>
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { body, method, headers } = options

  const response = await fetch(`${BASE_URL}/api${path}`, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }))
    throw Object.assign(new Error(error.message ?? 'Request failed'), { status: response.status })
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}
