import { UserDAO } from '@/application/dao/UserDAO'
import { DAOFactory } from '@/application/factory/DAOFactory'
import { HttpError } from '@/shared/error/HttpError'
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
      throw new HttpError('User Inexistent', 404)
    }

    return user
  }
}
