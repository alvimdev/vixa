import { z } from 'zod'

export const priorityEnum = z.enum(['NONE', 'LOW', 'MEDIUM', 'HIGH'])
export type Priority = z.infer<typeof priorityEnum>

export const createGiftSchema = z.object({
  title: z.string().trim().min(1, 'Título é obrigatório').max(120),
  description: z.string().trim().max(1000).optional(),
  url: z.url('URL inválida').max(2000).optional().or(z.literal('')),
  price: z.coerce.number().positive('Preço inválido').max(1_000_000).optional(),
  priority: priorityEnum.default('NONE'),
  groupIds: z.array(z.uuid()).max(50).default([]),
})

export const updateGiftSchema = createGiftSchema
  .partial()
  .omit({ groupIds: true })

export const setVisibilitySchema = z.object({
  groupIds: z.array(z.uuid()).max(50),
})

export type CreateGiftInput = z.infer<typeof createGiftSchema>
export type UpdateGiftInput = z.infer<typeof updateGiftSchema>
export type SetVisibilityInput = z.infer<typeof setVisibilitySchema>

export interface Gift {
  id: string
  title: string
  description: string | null
  url: string | null
  imageUrl: string | null
  price: string | null // Decimal do Prisma chega serializado como string
  priority: Priority
  createdAt: string
  updatedAt: string
  ownerId: string
}

export interface GiftWithOwner extends Gift {
  owner: {
    id: string
    name: string
    avatarUrl: string | null
  }
}

export interface GiftMine extends Gift {
  groupIds: string[]
}