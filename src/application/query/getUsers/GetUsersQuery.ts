import { UserDAO } from '@/application/dao/UserDAO'
import { DAOFactory } from '@/application/factory/DAOFactory'
import { DAOFactoryPrisma } from '@/infra/factory/DAOFactoryPrisma'

import { GetUsersInputDTO } from './GetUsersInputDTO'

export class GetUsersQuery {
  userDAO: UserDAO;

  constructor (readonly daoFactory: DAOFactory = new DAOFactoryPrisma()) {
    this.userDAO = daoFactory.createUserDAO()
  }

  async execute (input: GetUsersInputDTO): Promise<any> {
    const { page, records, order } = input

    const users = await this.userDAO.findAll(page, records, order)

    return users
  }
}
