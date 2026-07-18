import { z } from 'zod'

export const registerSchema = z.object({
  email: z.email().max(100),
  password: z.string().min(8).max(128),
  name: z.string().trim().min(1).max(80),
})

export const loginSchema = z.object({
  email: z.email().max(100),
  password: z.string().min(1).max(128),
})

export const googleLoginSchema = z.object({
  idToken: z.string().min(1),
})