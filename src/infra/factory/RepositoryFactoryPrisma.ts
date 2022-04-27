import type { PrismaClient } from '@prisma/client'

import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'

import { UserRepositoryPrisma } from '../repository/prisma/implementation/UserRepositoryPrisma'
import { UserTokenRepositoryPrisma } from '../repository/prisma/implementation/UserTokenRepositoryPrisma'

export class RepositoryFactoryPrisma implements RepositoryFactory {
  constructor (readonly client?: PrismaClient) {}

  createUserRepository (): UserRepositoryPrisma {
    return new UserRepositoryPrisma(this?.client)
  }

  createUserTokenRepository (): UserTokenRepositoryPrisma {
    return new UserTokenRepositoryPrisma(this?.client)
  }
}
