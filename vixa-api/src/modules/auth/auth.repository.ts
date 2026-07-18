import { prisma } from '@/shared/db/prisma.js'
import type { AuthProvider } from '@generated/prisma/client.js'

export const authRepository = {
  findByProvider(provider: AuthProvider, providerUserId: string) {
    return prisma.authAccount.findUnique({
      where: {
        provider_providerUserId: { provider, providerUserId },
      },
    })
  },

  findLocalAccountByUserId(userId: string) {
    return prisma.authAccount.findFirst({
      where: { userId, provider: 'LOCAL' },
    })
  },

  create(data: { userId: string; provider: AuthProvider; providerUserId: string, passwordHash?: string }) {
    return prisma.authAccount.create({ data })
  },
}