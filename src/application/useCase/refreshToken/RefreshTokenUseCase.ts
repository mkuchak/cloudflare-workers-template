import { config } from '@/config'
import { Token } from '@/domain/entity/Token'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
import { TokenRepository } from '@/domain/repository/TokenRepository'
import { UserRepository } from '@/domain/repository/UserRepository'
import { HttpError } from '@/shared/error/HttpError'
import { ProviderFactory } from '@/shared/infra/factory/ProviderFactory'
import { RepositoryFactoryPrisma } from '@/shared/infra/factory/RepositoryFactoryPrisma'
import { JWT } from '@/shared/provider/JWT/JWT'

import { RefreshTokenOutputDTO } from './RefreshTokenInputDTO'
import { RefreshTokenInputDTO } from './RefreshTokenOutputDTO'

export class RefreshTokenUseCase {
  tokenRepository: TokenRepository
  userRepository: UserRepository

  constructor(
    readonly repositoryFactory: RepositoryFactory = new RepositoryFactoryPrisma(),
    readonly jwt: JWT = new ProviderFactory().createJWTProvider(),
  ) {
    this.tokenRepository = repositoryFactory.createTokenRepository()
    this.userRepository = repositoryFactory.createUserRepository()
  }

  async execute(input: RefreshTokenInputDTO): Promise<RefreshTokenOutputDTO> {
    const { refreshToken, ...restInput } = input

    const token = await this.tokenRepository.findByToken(refreshToken)

    if (!token || token.isEmailToken) {
      throw new HttpError('Invalid Token', 401)
    }

    const user = await this.userRepository.findById(token.userId)

    if (!user || !user.isActive) {
      throw new HttpError('Invalid Token', 401)
    }

    const roles = user.role.map((role) => role.label)
    const permissions = Array.from(
      new Set(
        [].concat(
          user.role.reduce((acc, role) => [...acc, ...role.permission.map((permission) => permission.label)], []),
          user.permission.map((permission) => permission.label),
        ),
      ),
    )

    const accessToken = await this.jwt.sign(
      {
        id: token.userId,
        roles,
        permissions,
        exp: Math.floor(Date.now() / 1000) + 60 * config.jwtExpiration,
      },
      config.jwtSecret,
    )

    if (config.renewRefreshTokenExpiration) {
      token.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * config.refreshTokenExpiration)
    }

    const updatedToken = new Token({
      id: token.id,
      userId: token.userId,
      ...restInput,
      expiresAt: token.expiresAt,
      createdAt: token.createdAt,
    })

    await this.tokenRepository.save(updatedToken)

    return {
      accessToken,
      refreshToken: updatedToken.value,
    }
  }
}
