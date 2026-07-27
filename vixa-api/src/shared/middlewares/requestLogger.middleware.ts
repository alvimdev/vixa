import { randomUUID } from 'node:crypto'
import { createMiddleware } from 'hono/factory'
import { logger } from '@/shared/logging/logger.js'
import type { AppEnv } from '@/shared/types/hono.type.js'

export const requestLogger = createMiddleware<AppEnv>(async (c, next) => {
  const requestId = c.req.header('x-request-id') ?? randomUUID()
  const startedAt = performance.now()

  c.set('requestId', requestId)
  c.set('requestStartedAt', Date.now())
  c.header('X-Request-Id', requestId)

  try {
    await next()
  } finally {
    logger.info({
      requestId,
      method: c.req.method,
      path: c.req.path,
      statusCode: c.res.status,
      durationMs: Math.round((performance.now() - startedAt) * 100) / 100,
      clientIp: c.req.header('x-forwarded-for')?.split(',')[0].trim()
        ?? c.req.header('x-real-ip')
        ?? 'unknown',
      userId: c.get('userId'),
    }, 'request completed')
  }
})
