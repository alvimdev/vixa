import { serve } from '@hono/node-server'
import { app } from './app.js'
import { ensureRedisConnected } from './shared/redis/redis.js'
import { logger } from './shared/logging/logger.js'

const port = Number(process.env.PORT) || 3000

await ensureRedisConnected()

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    logger.info({ port: info.port }, 'server started')
  }
)
