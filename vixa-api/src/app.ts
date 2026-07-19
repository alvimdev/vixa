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
  .filter(Boolean)

app.use('*', cors({ origin: corsOrigins }))
app.use('*', requestLogger)

// Rate limit registrado ANTES de qualquer rota — inclusive /v1 e /v1/health.
// Fail-open garante que uma queda do Redis não derruba diagnóstico nem tráfego normal.
app.use(
  '*',
  rateLimit({
    capacity: 150,
    refillPerSecond: 100 / 60,
    keyPrefix: 'global',
    keyGenerator: byIp,
  })
)

app.get('/v1', (c) => c.json({ ok: true }))

app.get(
  '/v1/health',
  rateLimit({ capacity: 20, refillPerSecond: 10 / 60, keyPrefix: 'health', keyGenerator: byIp }),
  async (c) => {
    const health = await getHealth()
    return c.json(health, health.ok ? 200 : 503)
  }
)

app.route('/v1', v1)
app.onError(errorHandler)