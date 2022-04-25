import type { PrismaClient } from '@prisma/client'
import { createFetchClient } from 'prisma-client-dataproxy'

import { config } from '@/config'

export const DataProxyPrismaClient =
  process.env.NODE_ENV === 'development' &&
  createFetchClient<PrismaClient>({
    baseUrl: config.dataProxyURL,
  })
