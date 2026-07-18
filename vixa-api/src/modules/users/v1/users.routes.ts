import { Hono } from 'hono'
import { usersService } from '../users.service.js'
import { updateNameSchema, updateAvatarSchema, updateBirthdateSchema } from '../users.dto.js'
import { requireAuth } from '@/shared/middlewares/auth.middleware.js'
import type { AppEnv } from '@/shared/types/hono.type.js'

export const usersV1 = new Hono<AppEnv>()

usersV1.use('*', requireAuth)

usersV1.get('/me', async (c) => {
  const userId = c.get('userId')
  const profile = await usersService.getMyProfile(userId)
  return c.json(profile)
})

usersV1.get('/:id', async (c) => {
  const requesterId = c.get('userId')
  const profile = await usersService.getPublicProfile(c.req.param('id'), requesterId)
  return c.json(profile)
})

usersV1.patch('/me/name', async (c) => {
  const userId = c.get('userId')
  const body = updateNameSchema.parse(await c.req.json())
  const user = await usersService.updateName(userId, body.name)
  return c.json(user)
})

usersV1.patch('/me/avatar', async (c) => {
  const userId = c.get('userId')
  const body = updateAvatarSchema.parse(await c.req.json())
  const user = await usersService.updateAvatar(userId, body.avatarUrl)
  return c.json(user)
})

usersV1.patch('/me/birthdate', async (c) => {
  const userId = c.get('userId')
  const body = updateBirthdateSchema.parse(await c.req.json())
  const user = await usersService.updateBirthdate(userId, body.birthdate)
  return c.json(user)
})