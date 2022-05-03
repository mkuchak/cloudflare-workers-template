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

    if (!userToken || userToken.isEmailToken) {
      throw new AppError('Invalid Token', 401)
    }

    const accessToken = await jwt.sign(
      {
        id: userToken.userId,
        roles: ['admin', 'moderator'], // TODO: create a role entity
        permissions: ['read_user'], // TODO: create a permission entity
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
