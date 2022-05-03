import jwt from '@tsndr/cloudflare-worker-jwt'

import { Password } from '@/domain/entity/Password'
import { UserToken } from '@/domain/entity/UserToken'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
import { UserRepository } from '@/domain/repository/UserRepository'
import { UserTokenRepository } from '@/domain/repository/UserTokenRepository'
import { BcryptjsHashAdapter } from '@/infra/adapter/hash/BcryptjsHashAdapter'
import { Hash } from '@/infra/adapter/hash/Hash'
import { NanoidAdapter } from '@/infra/adapter/uuid/NanoidAdapter'
import { UUID } from '@/infra/adapter/uuid/UUID'
import { AppError } from '@/infra/error/AppError'
import { RepositoryFactoryPrisma } from '@/infra/factory/RepositoryFactoryPrisma'

import { AuthenticateUserInputDTO } from './AuthenticateUserInputDTO'
import { AuthenticateUserOutputDTO } from './AuthenticateUserOutputDTO'

export class AuthenticateUserUseCase {
  userRepository: UserRepository;
  userTokenRepository: UserTokenRepository;

  constructor (
    readonly repositoryFactory: RepositoryFactory = new RepositoryFactoryPrisma(),
    readonly hash: Hash = new BcryptjsHashAdapter(),
    readonly uuid: UUID = new NanoidAdapter(),
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
      throw new AppError('Invalid Password', 401) // avoid exposing the non-existence of the user
    }

    if (!(await Password.isValid(password, user.password, this.hash))) {
      throw new AppError('Invalid Password', 401)
    }

    // const accessToken = await new JwtAdapter().sign({
    const accessToken = await jwt.sign(
      {
        id: user.id,
        roles: ['admin', 'moderator'], // TODO: create a role entity
        permissions: ['read_user'], // TODO: create a permission entity
        exp: Math.floor(Date.now() / 1000) + 60 * 15, // 15 minutes
      },
      'secret',
    )

    const userToken = new UserToken(
      {
        userId: user.id,
        ...restInput,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
      },
      this.uuid,
    )

    await this.userTokenRepository.save(userToken)

    return {
      accessToken,
      refreshToken: userToken.token,
    }
  }
}
