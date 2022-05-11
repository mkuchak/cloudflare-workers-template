import { PermissionDAO } from '@/application/dao/PermissionDAO'
import { DAOFactory } from '@/application/factory/DAOFactory'
import { DAOFactoryPrisma } from '@/shared/infra/factory/DAOFactoryPrisma'

export class ListPermissionsQuery {
  permissionDAO: PermissionDAO

  constructor(private daoFactory: DAOFactory = new DAOFactoryPrisma()) {
    this.permissionDAO = this.daoFactory.createPermissionDAO()
  }

  async execute(): Promise<any> {
    const permission = await this.permissionDAO.findAll()

    return permission
  }
}
