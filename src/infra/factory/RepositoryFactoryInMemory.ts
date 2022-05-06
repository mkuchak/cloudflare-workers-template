import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'

import { TokenRepositoryInMemory } from '../repository/inMemory/TokenRepositoryInMemory'
import { UserRepositoryInMemory } from '../repository/inMemory/UserRepositoryInMemory'

export class RepositoryFactoryInMemory implements RepositoryFactory {
  createUserRepository(): UserRepositoryInMemory {
    return new UserRepositoryInMemory()
  }

  createTokenRepository(): TokenRepositoryInMemory {
    return new TokenRepositoryInMemory()
  }
}
