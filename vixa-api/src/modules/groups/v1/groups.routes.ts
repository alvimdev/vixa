import { Hono } from 'hono'
import { groupsService } from '../groups.service.js'
import { createGroupSchema, updateGroupSchema, joinGroupSchema } from '../groups.dto.js'
import { paginationSchema } from '@/shared/dtos/pagination.dto.js'
import { requireAuth } from '@/shared/middlewares/auth.middleware.js'
import type { AppEnv } from '@/shared/types/hono.type.js'
import { byIp, rateLimit } from '@/shared/middlewares/rateLimit.middleware.js'
import { bruteForceGuard } from '@/shared/middlewares/bruteforceGuard.middleware.js'

export const groupsV1 = new Hono<AppEnv>()

groupsV1.use('*', requireAuth)

groupsV1.post('/', async (c) => {
    const userId = c.get('userId') as string
    const body = createGroupSchema.parse(await c.req.json())
    const group = await groupsService.createGroup(userId, body)
    return c.json(group, 201)
})

groupsV1.post(
    '/join',
    rateLimit({ capacity: 15, refillPerSecond: 10 / 60, keyPrefix: 'groups-join', keyGenerator: byIp }),
    bruteForceGuard({
        keyPrefix: 'groups-join',
        keyGenerator: byIp,
        maxFailuresBeforePenalty: 5,
        baseDelaySeconds: 1,
        maxDelaySeconds: 300, // 5min (invite code errado é bem menos grave que senha errada)
        isFailure: (status) => status === 404, // NotFoundError do invite code inválido
    }),
    async (c) => {
        const userId = c.get('userId') as string
        const body = joinGroupSchema.parse(await c.req.json())
        const group = await groupsService.joinGroup(userId, body.inviteCode)
        return c.json(group)
    })

groupsV1.get('/', async (c) => {
    const userId = c.get('userId') as string
    const { limit, cursor } = paginationSchema.parse(c.req.query())
    const groups = await groupsService.listMyGroups(userId, limit, cursor)
    return c.json(groups)
})

groupsV1.get('/:id', async (c) => {
    const userId = c.get('userId') as string
    const group = await groupsService.getGroup(c.req.param('id'), userId)
    return c.json(group)
})

groupsV1.get('/:id/members', async (c) => {
    const userId = c.get('userId') as string
    const { limit, cursor } = paginationSchema.parse(c.req.query())
    const members = await groupsService.listMembers(c.req.param('id'), userId, limit, cursor)
    return c.json(members)
})

groupsV1.patch('/:id', async (c) => {
    const userId = c.get('userId') as string
    const body = updateGroupSchema.parse(await c.req.json())
    const group = await groupsService.updateGroup(c.req.param('id'), userId, body)
    return c.json(group)
})

groupsV1.delete('/:id/members/:userId', async (c) => {
    const adminUserId = c.get('userId') as string
    const targetUserId = c.req.param('userId')
    await groupsService.kickMember(c.req.param('id'), adminUserId, targetUserId)
    return c.body(null, 204)
})

groupsV1.post('/:id/leave', async (c) => {
    const userId = c.get('userId') as string
    await groupsService.leaveGroup(c.req.param('id'), userId)
    return c.body(null, 204)
})

groupsV1.post('/:id/invite-code', async (c) => {
  const userId = c.get('userId')
  const group = await groupsService.regenerateInviteCode(c.req.param('id'), userId)
  return c.json({ inviteCode: group.inviteCode })
})