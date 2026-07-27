import { createClient } from 'redis'
import { logger } from '@/shared/logging/logger.js'

export const redis = createClient({
  url: process.env.REDIS_URL!,
})

redis.on('error', (err) => {
  logger.error({ err }, 'redis connection error')
})

// node-redis (v4+) exige conexão explícita antes de qualquer comando —
// diferente do ioredis, que conecta lazy na primeira chamada.
let connected = false

export async function ensureRedisConnected() {
  if (!connected) {
    await redis.connect()
    connected = true
  }
}
