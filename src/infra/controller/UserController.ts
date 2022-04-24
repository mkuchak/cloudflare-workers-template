import { CreateUserUseCase } from '@/application/useCase/createUser/CreateUserUseCase'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'

export class UserController {
  constructor (readonly repositoryFactory: RepositoryFactory) {}

  async createUser (request: Request) {
    const input = request.content

    const createUserUseCase = new CreateUserUseCase(this.repositoryFactory)

    const output = await createUserUseCase.execute(input)

    return output
  }
}
