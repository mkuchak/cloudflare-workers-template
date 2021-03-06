import { UserDAO } from '@/application/dao/UserDAO'
import { DAOFactory } from '@/application/factory/DAOFactory'
import { HttpError } from '@/shared/error/HttpError'
import { DAOFactoryPrisma } from '@/shared/infra/factory/DAOFactoryPrisma'

import { GetProfileInputDTO } from './GetProfileInputDTO'
import { GetProfileOutputDTO } from './GetProfileOutputDTO'

export class GetProfileQuery {
  userDAO: UserDAO

  constructor(readonly daoFactory: DAOFactory = new DAOFactoryPrisma()) {
    this.userDAO = daoFactory.createUserDAO()
  }

  async execute(input: GetProfileInputDTO): Promise<GetProfileOutputDTO> {
    const user = await this.userDAO.findById(input.id)

    if (!user) {
      throw new HttpError('User Inexistent', 404)
    }

    const { id, isActive, role, permission, createdAt, updatedAt, ...userData } = user

    const roles = role.map((role: any) => role.label)
    const permissions = Array.from(
      new Set(
        [].concat(
          role.reduce(
            (acc: any, role: any) => [...acc, ...role.permission.map((permission: any) => permission.label)],
            [],
          ),
          permission.map((permission: any) => permission.label),
        ),
      ),
    )

    return { ...userData, roles, permissions }
  }
}
