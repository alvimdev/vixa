import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({ prisma: { $queryRaw: vi.fn() }, redis: { ping: vi.fn() } }))
vi.mock('@/shared/db/prisma.js', () => ({ prisma: mocks.prisma }))
vi.mock('@/shared/redis/redis.js', () => ({ redis: mocks.redis }))
const { getHealth } = await import('./health.service.js')

describe('getHealth', () => {
  beforeEach(() => vi.resetAllMocks())

  it('reports healthy only when database and Redis are available', async () => {
    mocks.prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }])
    mocks.redis.ping.mockResolvedValue('PONG')
    const health = await getHealth()
    expect(health.ok).toBe(true)
    expect(health.status).toBe('healthy')
    expect(health.dependencies).toMatchObject({ database: { status: 'up' }, redis: { status: 'up' } })
  })

  it('reports a degraded state without exposing dependency errors', async () => {
    mocks.prisma.$queryRaw.mockRejectedValue(new Error('database URL with credentials'))
    mocks.redis.ping.mockResolvedValue('PONG')
    const health = await getHealth()
    expect(health.ok).toBe(false)
    expect(health.status).toBe('degraded')
    expect(health.dependencies.database.status).toBe('down')
    expect(JSON.stringify(health)).not.toContain('credentials')
  })
})
