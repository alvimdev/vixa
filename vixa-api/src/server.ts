import { serve } from '@hono/node-server'
import { app } from './app.js'
import { ensureRedisConnected } from './shared/redis/redis.js'

const port = Number(process.env.PORT) || 3000

await ensureRedisConnected()

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`🎁 Server running on http://localhost:${info.port}`)
  }
)
