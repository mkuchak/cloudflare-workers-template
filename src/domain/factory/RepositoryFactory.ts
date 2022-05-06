import { TokenRepository } from '../repository/TokenRepository'
import { UserRepository } from '../repository/UserRepository'

export interface RepositoryFactory {
  createUserRepository(): UserRepository
  createTokenRepository(): TokenRepository
}
