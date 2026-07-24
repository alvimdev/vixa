import { z } from 'zod'

export const updateNameSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório').max(80),
})

export const updateAvatarSchema = z.object({
  avatarUrl: z.url('URL inválida').max(2000),
})

export const updateBirthdateSchema = z.object({
  birthdate: z.coerce
    .date({ error: 'Data inválida' })
    .max(new Date(), 'Data não pode estar no futuro'),
})

export type UpdateNameInput = z.infer<typeof updateNameSchema>
export type UpdateAvatarInput = z.infer<typeof updateAvatarSchema>
export type UpdateBirthdateInput = z.infer<typeof updateBirthdateSchema>

export interface PrivateProfile {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  birthdate: string | null
  createdAt: string
}

export interface PublicProfile {
  id: string
  name: string
  avatarUrl: string | null
  birthdate: string | null
}