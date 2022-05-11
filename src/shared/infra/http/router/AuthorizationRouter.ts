import { DAOFactory } from '@/application/factory/DAOFactory'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'

import { PermissionController } from '../../controller/PermissionController'
import { RoleController } from '../../controller/RoleController'
import { Http } from '../Http'
import { isUser } from '../middleware/isUser'
import { RouterResponse } from './Router'

export class AuthorizationRouter {
  roleController: RoleController
  permissionController: PermissionController

  constructor(readonly http: Http, readonly repositoryFactory: RepositoryFactory, readonly daoFactory: DAOFactory) {
    this.roleController = new RoleController(this.repositoryFactory, this.daoFactory)
    this.permissionController = new PermissionController(this.repositoryFactory, this.daoFactory)
  }

  init(path: string = '') {
    this.http.on(
      'get',
      `${path}/roles`,
      isUser(['admin']),
      async (request: Request): Promise<RouterResponse> => ({
        status: 200,
        payload: await this.roleController.listRoles(request),
      }),
    )

    this.http.on(
      'get',
      `${path}/permissions`,
      isUser(['admin']),
      async (request: Request): Promise<RouterResponse> => ({
        status: 200,
        payload: await this.permissionController.listPermissions(request),
      }),
    )

    this.http.on(
      'post',
      `${path}/roles`,
      isUser(['admin']),
      async (request: Request): Promise<RouterResponse> => ({
        status: 201,
        payload: await this.roleController.createRole(request),
      }),
    )

    this.http.on(
      'delete',
      `${path}/roles/:id`,
      isUser(['admin']),
      async (request: Request): Promise<RouterResponse> => ({
        status: 204,
        payload: await this.roleController.deleteRole(request),
      }),
    )

    this.http.on(
      'post',
      `${path}/permissions`,
      isUser(['admin']),
      async (request: Request): Promise<RouterResponse> => ({
        status: 201,
        payload: await this.permissionController.createPermission(request),
      }),
    )

    this.http.on(
      'delete',
      `${path}/permissions/:id`,
      isUser(['admin']),
      async (request: Request): Promise<RouterResponse> => ({
        status: 204,
        payload: await this.permissionController.deletePermission(request),
      }),
    )

    this.http.on(
      'post',
      `${path}/roles/:id/permissions`,
      isUser(['admin']),
      async (request: Request): Promise<RouterResponse> => ({
        status: 201,
        payload: await this.roleController.createRBAC(request),
      }),
    )

    this.http.on(
      'delete',
      `${path}/roles/:id/permissions`,
      isUser(['admin']),
      async (request: Request): Promise<RouterResponse> => ({
        status: 204,
        payload: await this.roleController.deleteRBAC(request),
      }),
    )
  }
}
