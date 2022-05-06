import { Token } from '@/domain/entity/Token'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
import { TokenRepository } from '@/domain/repository/TokenRepository'
import { AppError } from '@/infra/error/AppError'

import { DeleteTokenInputDTO } from './DeleteTokenInputDTO'

export class DeleteTokenUseCase {
  tokenRepository: TokenRepository

  constructor(readonly repositoryFactory: RepositoryFactory) {
    this.tokenRepository = repositoryFactory.createTokenRepository()
  }

  async execute(input: DeleteTokenInputDTO): Promise<void> {
    const { id, refreshToken, userId, ...restInput } = input

    let token

    if (id) {
      token = await this.tokenRepository.findById(id)
      token = token?.userId === userId && token
    } else if (refreshToken) {
      token = await this.tokenRepository.findByToken(refreshToken)
    }

    if (!token || token.isEmailToken) {
      throw new AppError('Invalid Token', 401)
    }

    // soft delete enforcing expiration
    const updatedToken = new Token({
      id: token.id,
      userId: token.userId,
      value: token.value,
      ...restInput,
      expiresAt: new Date(Date.now()), // expired
      createdAt: token.createdAt,
    })

    await this.tokenRepository.save(updatedToken)
  }
}
