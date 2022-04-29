import jwt from '@tsndr/cloudflare-worker-jwt'

import { UserToken } from '@/domain/entity/UserToken'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
import { UserTokenRepository } from '@/domain/repository/UserTokenRepository'
import { AppError } from '@/infra/error/AppError'
import { RepositoryFactoryPrisma } from '@/infra/factory/RepositoryFactoryPrisma'

import { RefreshUserTokenOutputDTO } from './RefreshUserTokenInputDTO'
import { RefreshUserTokenInputDTO } from './RefreshUserTokenOutputDTO'

export class RefreshUserTokenUseCase {
  userTokenRepository: UserTokenRepository;

  constructor (
    readonly repositoryFactory: RepositoryFactory = new RepositoryFactoryPrisma(),
  ) {
    this.userTokenRepository = repositoryFactory.createUserTokenRepository()
  }

  async execute (
    input: RefreshUserTokenInputDTO,
  ): Promise<RefreshUserTokenOutputDTO> {
    const { refreshToken, ...restInput } = input

    const userToken = await this.userTokenRepository.findByToken(refreshToken)

    if (
      !userToken ||
      userToken.expiresAt < new Date() ||
      userToken.isEmailToken
    ) {
      throw new AppError('Invalid Refresh Token', 401)
    }

    const accessToken = await jwt.sign(
      {
        id: userToken.userId,
        exp: Math.floor(Date.now() / 1000) + 60 * 15, // 15 minutes
      },
      'secret',
    )

    const updatedUserToken = new UserToken({
      id: userToken.id,
      userId: userToken.userId,
      ...restInput,
      expiresAt: userToken.expiresAt,
      createdAt: userToken.createdAt,
    })

    await this.userTokenRepository.save(updatedUserToken)

    return {
      accessToken,
      refreshToken: updatedUserToken.token,
    }
  }
}
