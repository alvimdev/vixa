import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { authV1 } from './modules/auth/v1/auth.routes.js'
import { groupsV1 } from './modules/groups/v1/groups.routes.js'
import { giftsV1 } from './modules/gifts/v1/gifts.routes.js'
import { usersV1 } from './modules/users/v1/users.routes.js'
import { errorHandler } from './shared/middlewares/error.middleware.js'
import { byIp, rateLimit } from './shared/middlewares/rateLimit.middleware.js'
import { requestLogger } from './shared/middlewares/requestLogger.middleware.js'
import { getHealth } from './shared/health/health.service.js'

const v1 = new Hono()

v1.route('/auth', authV1)
v1.route('/users', usersV1)
v1.route('/gifts', giftsV1)
v1.route('/groups', groupsV1)

export const app = new Hono()

const corsOrigins = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean) // remove string vazia se a env var não existir/estiver mal formatada

app.use('*', requestLogger)
app.use(
  '*',
  cors({
    origin: corsOrigins,
  })
)

// Ping leve para o cron do Render; não depende de banco nem de Redis.
app.get('/v1', (c) => c.json({ ok: true }))

// Fica fora do rate limit: se Redis cair, ainda é possível diagnosticar a causa.
app.get('/v1/health', async (c) => {
  const health = await getHealth()
  return c.json(health, health.ok ? 200 : 503)
})

// Rede de segurança ampla: 100 requisições sustentadas por minuto por IP,
// com rajada de até 150 (capacity) — protege infra contra flood grosseiro.
app.use(
  '*',
  rateLimit({
    capacity: 150,
    refillPerSecond: 100 / 60,
    keyPrefix: 'global',
    keyGenerator: byIp,
  })
)

app.route('/v1', v1)
app.onError(errorHandler)
