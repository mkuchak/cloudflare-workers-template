import { status } from 'itty-router-extras'

import { CreateUserUseCase } from '@/application/useCase/createUser/CreateUserUseCase'
import { UserRepositoryPrisma } from '@/infra/repository/prisma/implementation/UserRepositoryPrisma'

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

    return status(201, output)
  }
}
