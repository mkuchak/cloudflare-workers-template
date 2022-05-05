import { UserToken } from '@/domain/entity/UserToken'
import { UserTokenRepository } from '@/domain/repository/UserTokenRepository'

export class UserTokenRepositoryInMemory implements UserTokenRepository {
  private static instance: UserTokenRepositoryInMemory

  constructor(private userToken: UserToken[] = []) {
    if (!UserTokenRepositoryInMemory.instance) {
      UserTokenRepositoryInMemory.instance = this
    }

    return UserTokenRepositoryInMemory.instance
  }

  async save(userToken: UserToken): Promise<void> {
    this.userToken.push(userToken)
  }

  async findByToken(token: string): Promise<UserToken> {
    return this.userToken.find((userToken) => userToken.token === token)
  }

  async findById(id: string): Promise<UserToken> {
    return this.userToken.find((userToken) => userToken.id === id)
  }
}
