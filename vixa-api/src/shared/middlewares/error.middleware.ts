import type { ErrorHandler } from 'hono'
import { AppError } from '@/shared/errors/app.errors.js'

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof AppError) {
    return c.json({ error: err.message, code: err.code }, err.statusCode as any)
  }

  console.error('[unhandled error]', err)
  return c.json({ error: 'Erro interno do servidor' }, 500)
}