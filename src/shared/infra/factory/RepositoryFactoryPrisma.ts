import type { PrismaClient } from '@prisma/client'

import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'

import { PermissionRepositoryPrisma } from '../repository/prisma/implementation/PermissionRepositoryPrisma'
import { RoleRepositoryPrisma } from '../repository/prisma/implementation/RoleRepositoryPrisma'
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

  createRoleRepository(): RoleRepositoryPrisma {
    return new RoleRepositoryPrisma(this?.client)
  }

  createPermissionRepository(): PermissionRepositoryPrisma {
    return new PermissionRepositoryPrisma(this?.client)
  }
}
