import argon2 from 'argon2'

// Hash "morto" pré-computado, usado só pra igualar o tempo de resposta
// quando o email não existe no login — sem isso, "email inexistente" responde
// mais rápido que "senha errada", vazando informação por tempo de resposta.
const DUMMY_HASH = await argon2.hash('dummy-password-for-timing-safety')

export const localStrategy = {
  hashPassword(plain: string) {
    return argon2.hash(plain)
  },

  verifyPassword(hash: string, plain: string) {
    return argon2.verify(hash, plain)
  },

  async verifyDummy() {
    // sempre falha, mas consome tempo equivalente a uma verificação real
    await argon2.verify(DUMMY_HASH, 'irrelevant')
    return false
  },

  generateProviderUserId() {
    return crypto.randomUUID() // gera um ID aleatório para o usuário no provider LOCAL
  }
}