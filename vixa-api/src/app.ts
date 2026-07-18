import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { authV1 } from './modules/auth/v1/auth.routes.js'
import { groupsV1 } from './modules/groups/v1/groups.routes.js'
import { giftsV1 } from './modules/gifts/v1/gifts.routes.js'
import { usersV1 } from './modules/users/v1/users.routes.js'
import { errorHandler } from './shared/middlewares/error.middleware.js'
import { byIp, rateLimit } from './shared/middlewares/rateLimit.middleware.js'

const v1 = new Hono()

v1.get('/', (c) => c.json({ ok: true }))
v1.route('/auth', authV1)
v1.route('/users', usersV1)
v1.route('/gifts', giftsV1)
v1.route('/groups', groupsV1)

export const app = new Hono()

const corsOrigins = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean) // remove string vazia se a env var não existir/estiver mal formatada

app.use('*', logger())
app.use(
  '*',
  cors({
    origin: corsOrigins,
  })
)

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