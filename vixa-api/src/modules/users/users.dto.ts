import { z } from 'zod'

export const updateNameSchema = z.object({
  name: z.string().trim().min(1).max(80),
})

export const updateAvatarSchema = z.object({
  avatarUrl: z.url().max(2000),
})

export const updateBirthdateSchema = z.object({
  birthdate: z.coerce.date().max(new Date(), { message: 'Data de nascimento não pode estar no futuro' }),
})