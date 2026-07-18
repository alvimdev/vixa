import { createMiddleware } from 'hono/factory'
import { verify } from 'hono/jwt'
import type { AppEnv } from '@/shared/types/hono.type.js'

export const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Token não fornecido' }, 401)
  }

  const token = authHeader.replace('Bearer ', '')
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