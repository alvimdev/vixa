import { describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  prisma: { $queryRaw: vi.fn() },
  redis: { ping: vi.fn(), eval: vi.fn() },
}))

vi.mock('@/shared/db/prisma.js', () => ({ prisma: mocks.prisma }))
vi.mock('@/shared/redis/redis.js', () => ({ redis: mocks.redis }))

const { app } = await import('./app.js')

describe('operational endpoints', () => {
  it('keeps /v1 as a dependency-free ping endpoint', async () => {
    const response = await app.request('/v1')

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(mocks.redis.eval).not.toHaveBeenCalled()
  })

  it('returns detailed health when dependencies are available', async () => {
    mocks.prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }])
    mocks.redis.ping.mockResolvedValue('PONG')

    const response = await app.request('/v1/health')
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toMatchObject({
      ok: true,
      status: 'healthy',
      dependencies: { database: { status: 'up' }, redis: { status: 'up' } },
    })
    expect(body).toHaveProperty('uptimeSeconds')
    expect(mocks.redis.eval).not.toHaveBeenCalled()
  })

  it('returns 503 when an operational dependency is unavailable', async () => {
    mocks.prisma.$queryRaw.mockRejectedValue(new Error('unavailable'))
    mocks.redis.ping.mockResolvedValue('PONG')

    const response = await app.request('/v1/health')

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toMatchObject({ ok: false, status: 'degraded' })
  })
})
