import { DAOFactory } from '@/application/factory/DAOFactory'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'

import { UserController } from '../../controller/UserController'
import { Http } from '../Http'
import { isUser } from '../middleware/isUser'
import { Router, RouterResponse } from './Router'

export class UsersRouter {
  userController: UserController

  constructor(readonly http: Http, readonly repositoryFactory: RepositoryFactory, readonly daoFactory: DAOFactory) {
    this.userController = new UserController(this.repositoryFactory, this.daoFactory)
  }

  init(path: string = '') {
    const paths = Router.parsePath(path)

    this.http.on(
      'get',
      `${paths[1]}/me`,
      isUser(),
      async (request: Request): Promise<RouterResponse> => ({
        status: 200,
        payload: await this.userController.getProfile(request),
      }),
    )

    this.http.on(
      'get',
      `${path}`,
      isUser(['admin']),
      async (request: Request): Promise<RouterResponse> => ({
        status: 200,
        payload: await this.userController.listUsers(request),
      }),
    )

    this.http.on(
      'get',
      `${path}/:id`,
      isUser(['admin']),
      async (request: Request): Promise<RouterResponse> => ({
        status: 200,
        payload: await this.userController.getUser(request),
      }),
    )

    this.http.on(
      'post',
      `${path}/:id/rbac`,
      isUser(['admin']),
      async (request: Request): Promise<RouterResponse> => ({
        status: 201,
        payload: await this.userController.createUserRBAC(request),
      }),
    )

    this.http.on(
      'delete',
      `${path}/:id/rbac`,
      isUser(['admin']),
      async (request: Request): Promise<RouterResponse> => ({
        status: 204,
        payload: await this.userController.deleteUserRBAC(request),
      }),
    )
  }
}
