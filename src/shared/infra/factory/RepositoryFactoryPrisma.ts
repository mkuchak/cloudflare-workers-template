import type { PrismaClient } from '@prisma/client'

import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'

import { TokenRepositoryPrisma } from '../repository/prisma/implementation/TokenRepositoryPrisma'
import { UserRepositoryPrisma } from '../repository/prisma/implementation/UserRepositoryPrisma'

export class RepositoryFactoryPrisma implements RepositoryFactory {
  constructor(readonly client?: PrismaClient) {}

  createUserRepository(): UserRepositoryPrisma {
    return new UserRepositoryPrisma(this?.client)
  }

  createTokenRepository(): TokenRepositoryPrisma {
    return new TokenRepositoryPrisma(this?.client)
  }
}
