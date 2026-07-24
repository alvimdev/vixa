import { httpClient } from '@/shared/api/httpClient'
import type { RegisterInput, LoginInput, User } from '../schemas/auth.schema'

export const authApi = {
  register: (data: RegisterInput) =>
    httpClient.post<{ user: User }>('/auth/register', data),

  login: (data: LoginInput) =>
    httpClient.post<{ user: User }>('/auth/login', data),

  loginWithGoogle: (idToken: string) =>
    httpClient.post<{ user: User }>('/auth/google', { idToken }),

  logout: () => httpClient.post<void>('/auth/logout'),

  whoami: () => httpClient.get<{ user: User }>('/auth/whoami'),
}