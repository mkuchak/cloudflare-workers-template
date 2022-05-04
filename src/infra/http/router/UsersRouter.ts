import { DAOFactory } from '@/application/factory/DAOFactory'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
import { BcryptjsHashAdapter } from '@/infra/adapter/hash/BcryptjsHashAdapter'
import { Hash } from '@/infra/adapter/hash/Hash'
import { NanoidAdapter } from '@/infra/adapter/uuid/NanoidAdapter'
import { UUID } from '@/infra/adapter/uuid/UUID'

import { UserController } from '../../controller/UserController'
import { Http } from '../Http'
import { isUser } from '../middleware/isUser'
import { RouterResponse } from './Router'

export class UsersRouter {
  userController: UserController;

  constructor (
    readonly http: Http,
    readonly repositoryFactory: RepositoryFactory,
    readonly daoFactory: DAOFactory,
    readonly hash: Hash = new BcryptjsHashAdapter(),
    readonly uuid: UUID = new NanoidAdapter(),
  ) {
    this.userController = new UserController(this.repositoryFactory, this.daoFactory, this.hash, this.uuid)
  }

  init (path: string = '') {
    this.http.on(
      'get',
      `${path}`,
      isUser(['admin']),
      async (request: Request): Promise<RouterResponse> => ({
        status: 200,
        payload: await this.userController.getUsers(request),
      }),
    )
  }
}
