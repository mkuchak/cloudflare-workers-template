import { config } from '@/config'
import { Password } from '@/domain/entity/Password'
import { Token } from '@/domain/entity/Token'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
import { TokenRepository } from '@/domain/repository/TokenRepository'
import { UserRepository } from '@/domain/repository/UserRepository'
import { AppError } from '@/shared/error/AppError'
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
      throw new AppError('Invalid Password', 401) // avoid exposing the non-existence of the user
    }

    if (!user.isActive) {
      throw new AppError('User Inactive', 401)
    }

    if (!(await Password.isValid(password, user.password))) {
      throw new AppError('Invalid Password', 401)
    }

    /**
     * @attention Consider not storing this information in JWT and caching roles and permissions in KV
     * Then retrieve the information inside the isUser/canUser middlewares and validate it
     * So to retrieve this information on the client-side use a /me route, for example
     */
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
        id: user.id,
        roles,
        permissions,
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
