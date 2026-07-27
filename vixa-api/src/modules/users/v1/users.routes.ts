import { Hono } from 'hono'
import { usersService } from '../users.service.js'
import { updateNameSchema, updateBirthdateSchema } from '../users.dto.js'
import { rateLimit, byUserId } from '@/shared/middlewares/rateLimit.middleware.js'
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

usersV1.patch('/me/birthdate', async (c) => {
  const userId = c.get('userId')
  const body = updateBirthdateSchema.parse(await c.req.json())
  const user = await usersService.updateBirthdate(userId, body.birthdate)
  return c.json(user)
})

usersV1.post(
  '/me/avatar',
  rateLimit({ capacity: 10, refillPerSecond: 5 / 60, keyPrefix: 'avatar-upload', keyGenerator: byUserId }),
  async (c) => {
    const userId = c.get('userId')
    const body = await c.req.parseBody()
    const file = body.avatar

    if (!(file instanceof File)) {
      return c.json({ error: 'Arquivo de imagem é obrigatório' }, 400)
    }

    const user = await usersService.uploadAvatar(userId, file)
    return c.json(user)
  }
)