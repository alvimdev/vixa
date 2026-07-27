import { Hono } from 'hono'
import { giftsService } from '../gifts.service.js'
import { createGiftSchema, updateGiftSchema, setVisibilitySchema } from '../gifts.dto.js'
import { paginationSchema } from '@/shared/dtos/pagination.dto.js'
import { requireAuth } from '@/shared/middlewares/auth.middleware.js'
import { groupsV1 } from '@/modules/groups/v1/groups.routes.js'
import type { AppEnv } from '@/shared/types/hono.type.js'

export const giftsV1 = new Hono<AppEnv>()

giftsV1.use('*', requireAuth)

giftsV1.post('/', async (c) => {
  const userId = c.get('userId') as string
  const body = createGiftSchema.parse(await c.req.json())
  const gift = await giftsService.createGift(userId, body)
  return c.json(gift, 201)
})

giftsV1.get('/', async (c) => {
  const userId = c.get('userId') as string
  const { limit, cursor } = paginationSchema.parse(c.req.query())
  const gifts = await giftsService.getMyGifts(userId, limit, cursor)
  return c.json(gifts)
})

giftsV1.patch('/:id', async (c) => {
  const userId = c.get('userId') as string
  const body = updateGiftSchema.parse(await c.req.json())
  const gift = await giftsService.updateGift(c.req.param('id'), userId, body)
  return c.json(gift)
})

giftsV1.delete('/:id', async (c) => {
  const userId = c.get('userId') as string
  await giftsService.deleteGift(c.req.param('id'), userId)
  return c.body(null, 204)
})

giftsV1.put('/:id/visibility', async (c) => {
  const userId = c.get('userId') as string
  const body = setVisibilitySchema.parse(await c.req.json())
  const gift = await giftsService.setVisibility(c.req.param('id'), userId, body.groupIds)
  return c.json(gift)
})

groupsV1.get('/:id/gifts', async (c) => {
  const userId = c.get('userId') as string
  const { limit, cursor } = paginationSchema.parse(c.req.query())
  const gifts = await giftsService.getGroupGifts(c.req.param('id'), userId, limit, cursor)
  return c.json(gifts)
})