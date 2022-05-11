import { RoleDAO } from '@/application/dao/RoleDAO'
import { DAOFactory } from '@/application/factory/DAOFactory'
import { DAOFactoryPrisma } from '@/shared/infra/factory/DAOFactoryPrisma'

export class ListRolesQuery {
  roleDAO: RoleDAO

  constructor(private daoFactory: DAOFactory = new DAOFactoryPrisma()) {
    this.roleDAO = this.daoFactory.createRoleDAO()
  }

  async execute(): Promise<any> {
    const roles = await this.roleDAO.findAll()

    return roles
  }
}
