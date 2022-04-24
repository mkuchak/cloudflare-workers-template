import jwt from '@tsndr/cloudflare-worker-jwt'

import { UserToken } from '@/domain/entity/UserToken'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
import { UserRepository } from '@/domain/repository/UserRepository'
import { UserTokenRepository } from '@/domain/repository/UserTokenRepository'
import { BcryptjsAdapter } from '@/infra/adapter/crypto/BcryptjsAdapter'
import { Crypto } from '@/infra/adapter/crypto/Crypto'
import { APIError } from '@/infra/error/APIError'
import { RepositoryFactoryPrisma } from '@/infra/factory/RepositoryFactoryPrisma'

import { AuthenticateUserInputDTO } from './AuthenticateUserInputDTO'
import { AuthenticateUserOutputDTO } from './AuthenticateUserOutputDTO'

export class AuthenticateUserUseCase {
  userRepository: UserRepository;
  userTokenRepository: UserTokenRepository;

  constructor (
    readonly repositoryFactory: RepositoryFactory = new RepositoryFactoryPrisma(),
    readonly crypto: Crypto = new BcryptjsAdapter(),
  ) {
    this.userRepository = repositoryFactory.createUserRepository()
    this.userTokenRepository = repositoryFactory.createUserTokenRepository()
  }

  async execute (
    input: AuthenticateUserInputDTO,
  ): Promise<AuthenticateUserOutputDTO> {
    const { email, password, ...restInput } = input

    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new APIError(401, 'Invalid Password') // avoid exposing the non-existence of the user
    }

    const isPasswordCorrect = await user.checkPassword(password)

    if (!isPasswordCorrect) {
      throw new APIError(401, 'Invalid Password')
    }

    // const accessToken = await new JwtAdapter().sign({
    const accessToken = await jwt.sign(
      {
        id: user.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 15, // 15 minutes
      },
      'secret',
    )

    const userToken = new UserToken({
      userId: user.id,
      ...restInput,
      // expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
      expiresAt: 60 * 60 * 24 * 30, // 30 days
    })

    await this.userTokenRepository.save(userToken)

    return {
      accessToken,
      refreshToken: userToken.token,
    }
  }
}
