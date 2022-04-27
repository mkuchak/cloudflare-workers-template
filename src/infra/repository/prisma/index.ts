import type { PrismaClient } from '@prisma/client'
import { createFetchClient } from 'prisma-client-dataproxy'

import { config } from '@/config'

export const DataProxyPrismaClient =
  (config.nodeEnv === 'development' || config.nodeEnv === 'test') &&
  createFetchClient<PrismaClient>({
    baseUrl: config.dataProxyURL,
  })
