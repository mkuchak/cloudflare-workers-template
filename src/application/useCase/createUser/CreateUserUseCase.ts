import { User } from '@/domain/entity/User'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
import { UserRepository } from '@/domain/repository/UserRepository'
import { BcryptjsAdapter } from '@/infra/adapter/crypto/BcryptjsAdapter'
import { Crypto } from '@/infra/adapter/crypto/Crypto'
import { APIError } from '@/infra/error/APIError'
import { RepositoryFactoryPrisma } from '@/infra/factory/RepositoryFactoryPrisma'

import { CreateUserInputDTO } from './CreateUserInputDTO'
import { CreateUserOutputDTO } from './CreateUserOutputDTO'

export class CreateUserUseCase {
  userRepository: UserRepository;

  constructor (
    readonly repositoryFactory: RepositoryFactory = new RepositoryFactoryPrisma(),
    readonly crypto: Crypto = new BcryptjsAdapter(),
  ) {
    this.userRepository = repositoryFactory.createUserRepository()
  }

  async execute (input: CreateUserInputDTO): Promise<CreateUserOutputDTO> {
    const { email, password, name, picture } = input

    const isEmailAlreadyRegistered = !!(await this.userRepository.findByEmail(
      email,
    ))

    if (isEmailAlreadyRegistered) {
      throw new APIError(409, 'User Already Exists')
    }

    const user = new User({ email, password, name, picture })

    const isValidPassword = user.validatePassword()

    if (!isValidPassword) {
      throw new APIError(400, 'Weak Password')
    }

    await user.hashPassword()

    await this.userRepository.save(user)

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    }
  }
}
