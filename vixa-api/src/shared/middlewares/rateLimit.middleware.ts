import { createMiddleware } from 'hono/factory'
import { redis } from '@/shared/redis/redis.js'

const TOKEN_BUCKET_SCRIPT = `
local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refillPerSecond = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local requested = tonumber(ARGV[4])

local bucket = redis.call('HMGET', key, 'tokens', 'updatedAt')
local tokens = tonumber(bucket[1])
local updatedAt = tonumber(bucket[2])

if tokens == nil then
  tokens = capacity
  updatedAt = now
end

local elapsed = math.max(0, now - updatedAt)
tokens = math.min(capacity, tokens + elapsed * refillPerSecond)

local allowed = 0
if tokens >= requested then
  allowed = 1
  tokens = tokens - requested
end

redis.call('HMSET', key, 'tokens', tokens, 'updatedAt', now)
redis.call('EXPIRE', key, 3600)

return { allowed, tokens }
`

interface RateLimitOptions {
  capacity: number
  refillPerSecond: number
  keyPrefix: string
  keyGenerator: (c: any) => string
}

export function rateLimit(options: RateLimitOptions) {
  return createMiddleware(async (c, next) => {
    const identifier = options.keyGenerator(c)
    const key = `ratelimit:${options.keyPrefix}:${identifier}`
    const now = Date.now() / 1000

    const result = (await redis.eval(TOKEN_BUCKET_SCRIPT, {
      keys: [key],
      arguments: [
        String(options.capacity),
        String(options.refillPerSecond),
        String(now),
        '1',
      ],
    })) as [number, number]

    const [allowed, remaining] = result

    c.header('X-RateLimit-Limit', String(options.capacity))
    c.header('X-RateLimit-Remaining', String(Math.floor(remaining)))

    if (allowed === 0) {
      return c.json({ error: 'Muitas requisições. Tente novamente em instantes.' }, 429)
    }

    await next()
  })
}

export function byIp(c: any): string {
  return (
    c.req.header('x-forwarded-for')?.split(',')[0].trim() ??
    c.req.header('x-real-ip') ??
    'unknown'
  )
}

export function byUserId(c: any): string {
  return c.get('userId') ?? byIp(c)
}