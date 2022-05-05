import { UserRepository } from '../repository/UserRepository'
import { UserTokenRepository } from '../repository/UserTokenRepository'

export interface RepositoryFactory {
  createUserRepository(): UserRepository
  createUserTokenRepository(): UserTokenRepository
}
