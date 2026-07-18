import { z } from 'zod'

export const createGroupSchema = z.object({
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(300).optional(),
})

export const updateGroupSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  description: z.string().trim().max(300).optional(),
  photoUrl: z.url().optional(),
})

export const joinGroupSchema = z.object({
  inviteCode: z.string().trim().min(4).max(20),
})