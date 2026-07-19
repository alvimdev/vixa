import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  resolve: {
    alias: { '@': `${root}src`, '@generated': `${root}prisma/generated` },
  },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
})
