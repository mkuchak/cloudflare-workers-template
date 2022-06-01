import { DAOFactory } from '@/application/factory/DAOFactory'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'

import { TokenController } from '../../controller/TokenController'
import { UserController } from '../../controller/UserController'
import { Http } from '../Http'
import { isUser } from '../middleware/isUser'
import { RouterResponse } from './Router'

export class AuthenticationRouter {
  userController: UserController
  tokenController: TokenController

  constructor(readonly http: Http, readonly repositoryFactory: RepositoryFactory, readonly daoFactory: DAOFactory) {
    this.userController = new UserController(this.repositoryFactory, this.daoFactory)
    this.tokenController = new TokenController(this.repositoryFactory, this.daoFactory)
  }

  init(path: string = '') {
    this.http.on(
      'post',
      `${path}/register`,
      async (request: Request): Promise<RouterResponse> => ({
        status: 201,
        payload: await this.userController.createUser(request),
      }),
    )

    this.http.on(
      'post',
      `${path}/authenticate`,
      async (request: Request): Promise<RouterResponse> => ({
        status: 201,
        payload: await this.userController.authenticateUser(request),
      }),
    )

    this.http.on(
      'post',
      `${path}/sessions/:refreshToken`,
      async (request: Request): Promise<RouterResponse> => ({
        status: 201,
        payload: await this.tokenController.refreshToken(request),
      }),
    )

    this.http.on(
      'get',
      `${path}/sessions`,
      isUser(),
      async (request: Request): Promise<RouterResponse> => ({
        status: 200,
        payload: await this.tokenController.listTokens(request),
      }),
    )

    this.http.on(
      'delete',
      `${path}/sessions/:refreshToken/token`,
      async (request: Request): Promise<RouterResponse> => ({
        status: 204,
        payload: await this.tokenController.deleteToken(request),
      }),
    )

    this.http.on(
      'delete',
      `${path}/sessions/:id/id`,
      isUser(),
      async (request: Request): Promise<RouterResponse> => ({
        status: 204,
        payload: await this.tokenController.deleteToken(request),
      }),
    )
  }
}
