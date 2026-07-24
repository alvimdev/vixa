import type { ErrorHandler } from 'hono'
import { ZodError } from 'zod'
import { AppError } from '../errors/app.errors.js'

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof AppError) {
    return c.json({ error: err.message, code: err.code }, err.statusCode as any)
  }

  if (err instanceof ZodError) {
    return c.json(
      {
        error: 'Dados inválidos',
        code: 'VALIDATION_ERROR',
        details: err.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      },
      400
    )
  }

  console.error('[unhandled error]', err)
  return c.json({ error: 'Erro interno do servidor' }, 500)
}