import { CreateUserUseCase } from '@/application/useCase/createUser/CreateUserUseCase'
import { UserRepositoryPrisma } from '@/infra/repository/prisma/implementation/UserRepositoryPrisma'

import { ResponseJson } from '../http/response/ResponseJson'

export class CreateUserController {
  async handle (request: Request): Promise<Response> {
    const { email, password, name, picture } = request.content

    const userRepositoryPrisma = new UserRepositoryPrisma()

    const createUserUseCase = new CreateUserUseCase(userRepositoryPrisma)

    const output = await createUserUseCase.execute({
      email,
      password,
      name,
      picture,
    })

    return new ResponseJson(201, output)
  }
}
