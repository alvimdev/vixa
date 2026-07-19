import type { ErrorHandler } from 'hono'
import { AppError } from '@/shared/errors/app.errors.js'
import { logger } from '@/shared/logging/logger.js'

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof AppError) {
    logger.warn({ requestId: c.get('requestId'), statusCode: err.statusCode, code: err.code }, err.message)
    return c.json({ error: err.message, code: err.code }, err.statusCode as any)
  }

  logger.error({ err, requestId: c.get('requestId') }, 'unhandled request error')
  return c.json({ error: 'Erro interno do servidor' }, 500)
}
