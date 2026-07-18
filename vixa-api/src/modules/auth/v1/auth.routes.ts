import { Hono } from 'hono'
import { authService } from '../auth.service.js'
import { registerSchema, loginSchema, googleLoginSchema } from '../auth.dto.js'
import { byIp, rateLimit } from '@/shared/middlewares/rateLimit.middleware.js'
import { bruteForceGuard } from '@/shared/middlewares/bruteforceGuard.middleware.js'

export const authV1 = new Hono()

authV1.post(
  '/google',
  rateLimit({ capacity: 15, refillPerSecond: 10 / 60, keyPrefix: 'auth-google', keyGenerator: byIp }),
  async (c) => {
    const body = await c.req.json()
    const parsed = googleLoginSchema.safeParse(body)

    if (!parsed.success) {
      return c.json({ error: 'idToken é obrigatório' }, 400)
    }

    try {
      const { token, user } = await authService.loginWithGoogle(parsed.data.idToken)
      return c.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
        },
      })
    } catch (err) {
      console.error(err)
      return c.json({ error: 'Falha na autenticação com Google' }, 401)
    }
  })

authV1.post(
  '/register',
  rateLimit({ capacity: 15, refillPerSecond: 10 / 60, keyPrefix: 'auth-register', keyGenerator: byIp }),
  bruteForceGuard({
    keyPrefix: 'auth-login',
    keyGenerator: byIp,
    maxFailuresBeforePenalty: 5,
    baseDelaySeconds: 1,
    maxDelaySeconds: 900, // 15min
    isFailure: (status) => status === 401,
  }),
  async (c) => {
    const body = registerSchema.parse(await c.req.json())
    const { token, user } = await authService.register(body)
    return c.json(
      {
        token,
        user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
      },
      201
    )
  })

authV1.post(
  '/login',
  rateLimit({ capacity: 15, refillPerSecond: 10 / 60, keyPrefix: 'auth-login', keyGenerator: byIp }),
  async (c) => {
    const body = loginSchema.parse(await c.req.json())
    const { token, user } = await authService.loginWithPassword(body.email, body.password)
    return c.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
    })
  }
)