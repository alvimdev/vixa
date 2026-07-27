import { prisma } from '@/shared/db/prisma.js'
import { redis } from '@/shared/redis/redis.js'

type DependencyStatus = { status: 'up' | 'down'; latencyMs: number }

async function checkDependency(check: () => Promise<unknown>): Promise<DependencyStatus> {
  const startedAt = performance.now()
  try {
    await check()
    return { status: 'up', latencyMs: Math.round((performance.now() - startedAt) * 100) / 100 }
  } catch {
    return { status: 'down', latencyMs: Math.round((performance.now() - startedAt) * 100) / 100 }
  }
}

export async function getHealth() {
  const [database, redisStatus] = await Promise.all([
    checkDependency(() => prisma.$queryRaw`SELECT 1`),
    checkDependency(() => redis.ping()),
  ])
  const memory = process.memoryUsage()
  const ok = database.status === 'up' && redisStatus.status === 'up'

  return {
    ok,
    status: ok ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    version: process.env.APP_VERSION ?? process.env.npm_package_version ?? 'unknown',
    environment: process.env.NODE_ENV ?? 'development',
    deployment: {
      commit: process.env.RENDER_GIT_COMMIT ?? process.env.GIT_COMMIT ?? null,
    },
    runtime: { node: process.version, platform: process.platform, architecture: process.arch },
    memory: {
      rssBytes: memory.rss,
      heapUsedBytes: memory.heapUsed,
      heapTotalBytes: memory.heapTotal,
      externalBytes: memory.external,
    },
    dependencies: { database, redis: redisStatus },
  }
}
