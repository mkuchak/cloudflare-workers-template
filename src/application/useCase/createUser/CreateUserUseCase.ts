import { Password } from '@/domain/entity/Password'
import { User } from '@/domain/entity/User'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
import { UserRepository } from '@/domain/repository/UserRepository'
import { BcryptjsHashAdapter } from '@/infra/adapter/hash/BcryptjsHashAdapter'
import { Hash } from '@/infra/adapter/hash/Hash'
import { NanoidAdapter } from '@/infra/adapter/uuid/NanoidAdapter'
import { UUID } from '@/infra/adapter/uuid/UUID'
import { AppError } from '@/infra/error/AppError'
import { RepositoryFactoryPrisma } from '@/infra/factory/RepositoryFactoryPrisma'

import { CreateUserInputDTO } from './CreateUserInputDTO'
import { CreateUserOutputDTO } from './CreateUserOutputDTO'

export class CreateUserUseCase {
  userRepository: UserRepository

  constructor(
    readonly repositoryFactory: RepositoryFactory = new RepositoryFactoryPrisma(),
    readonly hash: Hash = new BcryptjsHashAdapter(),
    readonly uuid: UUID = new NanoidAdapter(),
  ) {
    this.userRepository = repositoryFactory.createUserRepository()
  }

  async execute(input: CreateUserInputDTO): Promise<CreateUserOutputDTO> {
    const isEmailAlreadyRegistered = !!(await this.userRepository.findByEmail(input.email))

    if (isEmailAlreadyRegistered) {
      throw new AppError('User Already Exists', 409)
    }

    const user = new User(input, this.uuid)

    user.password = await Password.hash(user.password, this.hash)

    await this.userRepository.save(user)

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    }
  }
}
