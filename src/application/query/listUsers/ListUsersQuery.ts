import { UserDAO } from '@/application/dao/UserDAO'
import { DAOFactory } from '@/application/factory/DAOFactory'
import { DAOFactoryPrisma } from '@/shared/infra/factory/DAOFactoryPrisma'

import { ListUsersInputDTO } from './ListUsersInputDTO'

export class ListUsersQuery {
  userDAO: UserDAO

  constructor(readonly daoFactory: DAOFactory = new DAOFactoryPrisma()) {
    this.userDAO = daoFactory.createUserDAO()
  }

  async execute(input: ListUsersInputDTO): Promise<any> {
    const { page, records, order } = input

    const users = await this.userDAO.findAll(page, records, order)

    return users
  }
}
