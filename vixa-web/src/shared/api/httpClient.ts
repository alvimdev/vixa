const BASE_URL = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  constructor(public status: number, message: string, public code?: string) {
    super(message)
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include', // essencial: manda o cookie httpOnly em toda requisição
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body.error ?? 'Erro desconhecido', body.code)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

export const httpClient = {
  get: <T>(path: string, params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : ''
    return request<T>(`${path}${query}`, { method: 'GET' })
  },
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
