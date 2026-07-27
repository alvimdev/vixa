import { sign } from 'hono/jwt'
import { usersRepository } from '../users/users.repository.js'
import { authRepository } from './auth.repository.js'
import { verifyGoogleToken } from './strategies/google.strategy.js'
import { localStrategy } from './strategies/local.strategy.js'
import { AppError, ConflictError } from '@/shared/errors/app.errors.js'

export const COOKIE_NAME = 'vixa_session'

async function issueJwt(userId: string) {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET não configurado')

  const payload = {
    sub: userId,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 dias
  }

  return sign(payload, secret, 'HS256')
}

export const authService = {
  async loginWithGoogle(idToken: string) {
    const googleData = await verifyGoogleToken(idToken)

    let account = await authRepository.findByProvider('GOOGLE', googleData.providerUserId)

    if (!account) {
      let user = await usersRepository.findByEmail(googleData.email)

      if (!user) {
        user = await usersRepository.create({
          name: googleData.name,
          email: googleData.email,
          avatarUrl: googleData.avatarUrl,
        })
      }

      account = await authRepository.create({
        userId: user.id,
        provider: 'GOOGLE',
        providerUserId: googleData.providerUserId,
      })
    }

    const user = await usersRepository.findById(account.userId)
    if (!user) throw new Error('Usuário não encontrado após autenticação')

    const token = await issueJwt(user.id)

    return { token, user }
  },

  async register(data: { name: string; email: string; password: string }) {
    const existing = await usersRepository.findByEmail(data.email)
    if (existing) {
      throw new ConflictError('Esse email já está em uso')
    }

    const passwordHash = await localStrategy.hashPassword(data.password)

    const user = await usersRepository.create({ name: data.name, email: data.email })
    await authRepository.create({
      userId: user.id,
      provider: 'LOCAL',
      providerUserId: localStrategy.generateProviderUserId(),
      passwordHash,
    })

    const token = await issueJwt(user.id)
    return { token, user }
  },

  async loginWithPassword(email: string, password: string) {
    const user = await usersRepository.findByEmail(email)

    if (!user) {
      await localStrategy.verifyDummy()
      throw new AppError(401, 'Email ou senha inválidos', 'INVALID_CREDENTIALS')
    }

    const localAccount = await authRepository.findLocalAccountByUserId(user.id)

    if (!localAccount || !localAccount.passwordHash) {
      await localStrategy.verifyDummy()
      throw new AppError(401, 'Email ou senha inválidos', 'INVALID_CREDENTIALS')
    }

    const valid = await localStrategy.verifyPassword(localAccount.passwordHash, password)
    if (!valid) {
      throw new AppError(401, 'Email ou senha inválidos', 'INVALID_CREDENTIALS')
    }

    const token = await issueJwt(user.id)
    return { token, user }
  },
}