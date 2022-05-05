import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'

import { UserRepositoryInMemory } from '../repository/inMemory/UserRepositoryInMemory'
import { UserTokenRepositoryInMemory } from '../repository/inMemory/UserTokenRepositoryInMemory'

export class RepositoryFactoryInMemory implements RepositoryFactory {
  createUserRepository(): UserRepositoryInMemory {
    return new UserRepositoryInMemory()
  }

  createUserTokenRepository(): UserTokenRepositoryInMemory {
    return new UserTokenRepositoryInMemory()
  }
}
