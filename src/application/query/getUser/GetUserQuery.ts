import { UserDAO } from '@/application/dao/UserDAO'
import { DAOFactory } from '@/application/factory/DAOFactory'
import { AppError } from '@/shared/error/AppError'
import { DAOFactoryPrisma } from '@/shared/infra/factory/DAOFactoryPrisma'

import { GetUserInputDTO } from './GetUserInputDTO'
import { GetUserOutputDTO } from './GetUserOutputDTO'

export class GetUserQuery {
  userDAO: UserDAO

  constructor(readonly daoFactory: DAOFactory = new DAOFactoryPrisma()) {
    this.userDAO = daoFactory.createUserDAO()
  }

  async execute(input: GetUserInputDTO): Promise<GetUserOutputDTO> {
    const user = await this.userDAO.findById(input.id)

    if (!user) {
      throw new AppError('User Inexistent', 400)
    }

    return user
  }
}
