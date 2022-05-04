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
    const { id, refreshToken, userId, ...restInput } = input

    let userToken

    if (id) {
      userToken = await this.userTokenRepository.findById(id)
      userToken = userToken?.userId === userId && userToken
    } else if (refreshToken) {
      userToken = await this.userTokenRepository.findByToken(refreshToken)
    }

    if (!userToken || userToken.isEmailToken) {
      throw new AppError('Invalid Token', 401)
    }

    // soft delete enforcing expiration
    const updatedUserToken = new UserToken({
      id: userToken.id,
      userId: userToken.userId,
      token: userToken.token,
      ...restInput,
      expiresAt: new Date(Date.now()), // expired
      createdAt: userToken.createdAt,
    })

    await this.userTokenRepository.save(updatedUserToken)
  }
}
