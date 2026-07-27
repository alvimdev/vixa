import { createMiddleware } from 'hono/factory'
import { redis } from '@/shared/redis/redis.js'

interface BruteForceOptions {
  keyPrefix: string
  keyGenerator: (c: any) => string
  maxFailuresBeforePenalty: number
  baseDelaySeconds: number
  maxDelaySeconds: number
  isFailure: (status: number) => boolean
}

export function bruteForceGuard(options: BruteForceOptions) {
  return createMiddleware(async (c, next) => {
    const identifier = options.keyGenerator(c)
    const blockKey = `bruteforce:${options.keyPrefix}:block:${identifier}`
    const failKey = `bruteforce:${options.keyPrefix}:fails:${identifier}`

    const isBlocked = await redis.get(blockKey)
    if (isBlocked) {
      const ttl = await redis.ttl(blockKey)
      c.header('Retry-After', String(ttl))
      return c.json({ error: 'Muitas tentativas. Aguarde antes de tentar novamente.' }, 429)
    }

    await next()

    const status = c.res.status
    if (options.isFailure(status)) {
      const fails = await redis.incr(failKey)
      await redis.expire(failKey, 60 * 30)

      if (fails > options.maxFailuresBeforePenalty) {
        const exponent = fails - options.maxFailuresBeforePenalty
        const delay = Math.min(
          options.baseDelaySeconds * 2 ** (exponent - 1),
          options.maxDelaySeconds
        )
        await redis.set(blockKey, '1', { EX: delay })
      }
    } else {
      await redis.del(failKey)
    }
  })
}