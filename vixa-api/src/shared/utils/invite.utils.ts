import { randomBytes } from 'node:crypto'

// Evita caracteres ambíguos (0/O, 1/I/L) pra reduzir erro de digitação humana
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

export function generateInviteCode(length = 7): string {
  const bytes = randomBytes(length)
  let code = ''
  for (let i = 0; i < length; i++) {
    code += ALPHABET[bytes[i] % ALPHABET.length]
  }
  return code
}