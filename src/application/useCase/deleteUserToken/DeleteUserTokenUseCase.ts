import { UserToken } from '@/domain/entity/UserToken'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
import { UserTokenRepository } from '@/domain/repository/UserTokenRepository'
import { AppError } from '@/infra/error/AppError'

import { DeleteUserTokenInputDTO } from './DeleteUserTokenInputDTO'

export class DeleteUserTokenUseCase {
  userTokenRepository: UserTokenRepository;

  constructor (readonly repositoryFactory: RepositoryFactory) {
    this.userTokenRepository = repositoryFactory.createUserTokenRepository()
  }

  async execute (input: DeleteUserTokenInputDTO): Promise<void> {
    const { id, refreshToken, ...restInput } = input

    let userToken
    if (id) {
      userToken = await this.userTokenRepository.findById(id)
    } else if (refreshToken) {
      userToken = await this.userTokenRepository.findByToken(refreshToken)
    }

    if (!userToken || userToken.isEmailToken) {
      throw new AppError('Invalid Token', 401)
    }

    // Soft delete enforcing expiration
    const updatedUserToken = new UserToken({
      id: userToken.id,
      userId: userToken.userId,
      token: refreshToken,
      ...restInput,
      expiresAt: new Date(Date.now() + 10), // 10 ms ahead to secure against clock skew (Workers locks the timer, but Node.js doesn't)
      createdAt: userToken.createdAt,
    })

    await this.userTokenRepository.save(updatedUserToken)
  }
}
