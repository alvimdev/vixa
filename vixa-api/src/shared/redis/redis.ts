import { createClient } from 'redis'

export const redis = createClient({
  url: process.env.REDIS_URL!,
})

redis.on('error', (err) => {
  console.error('[redis] connection error', err)
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