import { config } from '@/config'
import { Token } from '@/domain/entity/Token'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
import { TokenRepository } from '@/domain/repository/TokenRepository'
import { UserRepository } from '@/domain/repository/UserRepository'
import { HttpError } from '@/shared/error/HttpError'
import { ProviderFactory } from '@/shared/infra/factory/ProviderFactory'
import { RepositoryFactoryPrisma } from '@/shared/infra/factory/RepositoryFactoryPrisma'
import { JWT } from '@/shared/provider/JWT/JWT'

import { AuthenticateUserInputDTO } from './AuthenticateUserInputDTO'
import { AuthenticateUserOutputDTO } from './AuthenticateUserOutputDTO'

export class AuthenticateUserUseCase {
  userRepository: UserRepository
  tokenRepository: TokenRepository

  constructor(
    readonly repositoryFactory: RepositoryFactory = new RepositoryFactoryPrisma(),
    readonly jwt: JWT = new ProviderFactory().createJWTProvider(),
  ) {
    this.userRepository = repositoryFactory.createUserRepository()
    this.tokenRepository = repositoryFactory.createTokenRepository()
  }

  async execute(input: AuthenticateUserInputDTO): Promise<AuthenticateUserOutputDTO> {
    const { email, password, ...restInput } = input

    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new HttpError('Invalid Password', 401) // avoid exposing the non-existence of the user
    }

    if (!user.isActive) {
      throw new HttpError('User Inactive', 401)
    }

    if (!(await user.password.isValid(password))) {
      throw new HttpError('Invalid Password', 401)
    }

    /**
     * @attention Consider not storing this information in JWT and caching roles and permissions in KV
     * Then retrieve the information inside the isUser/canUser middlewares through KV and validate it
     * To obtain this information on the client-side use "/me" route
     * This was implemented in AuthenticateUserUseCase and RefreshTokenUseCase
     */
    const accessToken = await this.jwt.sign(
      {
        id: user.id,
        roles: user.rolesLabels,
        permissions: user.permissionsLabels,
        exp: Math.floor(Date.now() / 1000) + 60 * config.jwtExpiration,
      },
      config.jwtSecret,
    )

    const token = new Token({
      userId: user.id,
      ...restInput,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * config.refreshTokenExpiration),
    })

    await this.tokenRepository.save(token)

    return {
      accessToken,
      refreshToken: token.value,
    }
  }
}
