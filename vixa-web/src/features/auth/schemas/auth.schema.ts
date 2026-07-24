import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório').max(80),
  email: z.email('Email inválido').max(100),
  password: z.string().min(8, 'Mínimo de 8 caracteres').max(128),
})

export const loginSchema = z.object({
  email: z.email('Email inválido').max(100),
  password: z.string().min(1, 'Senha é obrigatória').max(128),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>

export interface User {
  id: string
  name: string
  email: string
  avatarUrl: string | null
}