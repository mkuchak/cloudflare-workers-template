import { CreateUserUseCase } from '@/application/useCase/createUser/CreateUserUseCase'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'

import { ResponseJson } from '../http/response/ResponseJson'

export class CreateUserController {
  constructor (readonly repositoryFactory: RepositoryFactory) {}

  async handle (request: Request): Promise<Response> {
    const { email, password, name, picture } = request.content

    const createUserUseCase = new CreateUserUseCase(this.repositoryFactory)

    const output = await createUserUseCase.execute({
      email,
      password,
      name,
      picture,
    })

    return new ResponseJson(201, output)
  }
}
