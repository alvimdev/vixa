import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  base: {
    service: 'vixa-api',
    environment: process.env.NODE_ENV ?? 'development',
  },
  redact: {
    paths: [
      'req.headers.authorization', 'req.headers.cookie', 'authorization', 'cookie',
      'password', 'token', 'idToken',
    ],
    censor: '[REDACTED]',
  },
})
