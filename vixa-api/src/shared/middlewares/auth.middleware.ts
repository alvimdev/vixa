import { createMiddleware } from 'hono/factory'
import { verify } from 'hono/jwt'
import { getCookie } from 'hono/cookie'
import type { AppEnv } from '@/shared/types/hono.type.js'
import { COOKIE_NAME } from '@/modules/auth/auth.service.js'

export const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
  const token = getCookie(c, COOKIE_NAME)

  if (!token) {
    return c.json({ error: 'Token não fornecido' }, 401)
  }

  const secret = process.env.JWT_SECRET
  if (!secret) {
    return c.json({ error: 'Configuração de auth ausente' }, 500)
  }

  try {
    const payload = await verify(token, secret, 'HS256')
    c.set('userId', payload.sub as string)
    await next()
  } catch {
    return c.json({ error: 'Token inválido ou expirado' }, 401)
  }
})