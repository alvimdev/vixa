import { z } from 'zod'

export const createGiftSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(1000).optional(),
  url: z.url().max(2000).optional(),
  imageUrl: z.url().optional(),
  price: z.number().positive().max(1_000_000).optional(),
  priority: z.enum(['NONE', 'LOW', 'MEDIUM', 'HIGH']).default('NONE'),
  groupIds: z.array(z.uuid()).max(50).default([]), // vazio = só privado
})

export const updateGiftSchema = createGiftSchema.partial().omit({ groupIds: true })

export const setVisibilitySchema = z.object({
  groupIds: z.array(z.uuid()).max(50),
})