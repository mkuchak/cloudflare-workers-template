import { User } from '@/domain/entity/User'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
import { UserRepository } from '@/domain/repository/UserRepository'
import { BcryptjsAdapter } from '@/infra/adapter/crypto/BcryptjsAdapter'
import { Crypto } from '@/infra/adapter/crypto/Crypto'
import { RepositoryFactoryPrisma } from '@/infra/factory/RepositoryFactoryPrisma'
import { ResponseError } from '@/infra/http/response/ResponseError'

import { CreateUserInputDTO } from './CreateUserInputDTO'
import { CreateUserOutputDTO } from './CreateUserOutputDTO'

export class CreateUserUseCase {
  userRepository: UserRepository;

  constructor (
    readonly repositoryFactory: RepositoryFactory = new RepositoryFactoryPrisma(),
    readonly cryptoAdapter: Crypto = new BcryptjsAdapter(),
  ) {
    this.userRepository = repositoryFactory.createUserRepository()
  }

  async execute (input: CreateUserInputDTO): Promise<CreateUserOutputDTO> {
    const { email, password, name, picture } = input

    const emailAlreadyExists = !!(await this.userRepository.findByEmail(email))

    if (emailAlreadyExists) {
      throw new ResponseError(409, 'User Already Exists')
    }

    const hashedPassword = await this.cryptoAdapter.hash(password)

    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      picture,
    })

    await this.userRepository.save(user)

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    }
  }
}
