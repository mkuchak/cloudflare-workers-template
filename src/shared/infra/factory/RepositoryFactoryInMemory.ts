import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'

import { PermissionRepositoryInMemory } from '../repository/inMemory/PermissionRepositoryInMemory'
import { RoleRepositoryInMemory } from '../repository/inMemory/RoleRepositoryInMemory'
import { TokenRepositoryInMemory } from '../repository/inMemory/TokenRepositoryInMemory'
import { UserRepositoryInMemory } from '../repository/inMemory/UserRepositoryInMemory'

export class RepositoryFactoryInMemory implements RepositoryFactory {
  createUserRepository(): UserRepositoryInMemory {
    return new UserRepositoryInMemory()
  }

  createTokenRepository(): TokenRepositoryInMemory {
    return new TokenRepositoryInMemory()
  }

  createRoleRepository(): RoleRepositoryInMemory {
    return new RoleRepositoryInMemory()
  }

  createPermissionRepository(): PermissionRepositoryInMemory {
    return new PermissionRepositoryInMemory()
  }
}
