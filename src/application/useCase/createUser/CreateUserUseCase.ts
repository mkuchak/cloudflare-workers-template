import { User } from '@/domain/entity/User'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
import { UserRepository } from '@/domain/repository/UserRepository'
import { HttpError } from '@/shared/error/HttpError'
import { RepositoryFactoryPrisma } from '@/shared/infra/factory/RepositoryFactoryPrisma'

import { CreateUserInputDTO } from './CreateUserInputDTO'
import { CreateUserOutputDTO } from './CreateUserOutputDTO'

export class CreateUserUseCase {
  userRepository: UserRepository

  constructor(readonly repositoryFactory: RepositoryFactory = new RepositoryFactoryPrisma()) {
    this.userRepository = repositoryFactory.createUserRepository()
  }

  async execute(input: CreateUserInputDTO): Promise<CreateUserOutputDTO> {
    const isEmailAlreadyRegistered = !!(await this.userRepository.findByEmail(input.email))

    if (isEmailAlreadyRegistered) {
      throw new HttpError('User Already Exists', 409)
    }

    const user = new User(input)

    await user.password.hash()

    await this.userRepository.save(user)

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    }
  }
}
