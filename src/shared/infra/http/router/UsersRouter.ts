import { DAOFactory } from '@/application/factory/DAOFactory'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'

import { UserController } from '../../controller/UserController'
import { Http } from '../Http'
import { isUser } from '../middleware/isUser'
import { RouterResponse } from './Router'

export class UsersRouter {
  userController: UserController

  constructor(readonly http: Http, readonly repositoryFactory: RepositoryFactory, readonly daoFactory: DAOFactory) {
    this.userController = new UserController(this.repositoryFactory, this.daoFactory)
  }

  init(path: string = '') {
    this.http.on(
      'get',
      `${path}`,
      isUser(['admin']),
      async (request: Request): Promise<RouterResponse> => ({
        status: 200,
        payload: await this.userController.listUsers(request),
      }),
    )
  }
}
