import { Hono } from 'hono'
import { authService } from '../auth.service.js'
import { registerSchema, loginSchema, googleLoginSchema } from '../auth.dto.js'
import { byIp, rateLimit } from '@/shared/middlewares/rateLimit.middleware.js'
import { bruteForceGuard } from '@/shared/middlewares/bruteforceGuard.middleware.js'
import { setCookie } from 'hono/cookie'
import { deleteCookie } from 'hono/cookie'
import { getCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'
import { usersRepository } from '@/modules/users/users.repository.js'
import { COOKIE_NAME } from '../auth.service.js'
import { logger } from '@/shared/logging/logger.js'

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

      setCookie(c, COOKIE_NAME, token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax', // funciona pq app./api. vão compartilhar domínio raiz
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 dias, mesmo prazo do JWT
      })

      return c.json({
        user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
      })
    } catch (err) {
      logger.warn({ err }, 'google authentication failed')
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

    setCookie(c, COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })

    return c.json(
      { user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl } },
      201
    )
  })

authV1.post(
  '/login',
  rateLimit({ capacity: 15, refillPerSecond: 10 / 60, keyPrefix: 'auth-login', keyGenerator: byIp }),
  async (c) => {
    const body = loginSchema.parse(await c.req.json())
    const { token, user } = await authService.loginWithPassword(body.email, body.password)

    setCookie(c, COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })

    return c.json({
      user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
    })
  }
)

authV1.post('/logout', async (c) => {
  deleteCookie(c, COOKIE_NAME, { path: '/' })
  return c.body(null, 204)
})

authV1.get('/whoami', async (c) => {
  const token = getCookie(c, COOKIE_NAME)
  if (!token) return c.json({ error: 'Não autenticado' }, 401)

  try {
    const payload = await verify(token, process.env.JWT_SECRET!, 'HS256')
    const user = await usersRepository.findById(payload.sub as string)
    if (!user) return c.json({ error: 'Não autenticado' }, 401)
    return c.json({ user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl } })
  } catch {
    return c.json({ error: 'Não autenticado' }, 401)
  }
})