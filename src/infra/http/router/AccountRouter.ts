import { DAOFactory } from '@/application/factory/DAOFactory'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
import { BcryptjsHashAdapter } from '@/infra/adapter/hash/BcryptjsHashAdapter'
import { Hash } from '@/infra/adapter/hash/Hash'
import { NanoidAdapter } from '@/infra/adapter/uuid/NanoidAdapter'
import { UUID } from '@/infra/adapter/uuid/UUID'

import { UserController } from '../../controller/UserController'
import { UserTokenController } from '../../controller/UserTokenController'
import { Http } from '../Http'
import { isUser } from '../middleware/isUser'
import { RouterResponse } from './Router'

export class AccountRouter {
  constructor (
    readonly http: Http,
    readonly repositoryFactory: RepositoryFactory,
    readonly daoFactory: DAOFactory,
    readonly hash: Hash = new BcryptjsHashAdapter(),
    readonly uuid: UUID = new NanoidAdapter(),
  ) {}

  init (path: string = '') {
    this.http.on(
      'post',
      `${path}/register`,
      async (request: Request): Promise<RouterResponse> => ({
        status: 201,
        payload: await new UserController(
          this.repositoryFactory,
          this.hash,
          this.uuid,
        ).createUser(request),
      }),
    )

    this.http.on(
      'post',
      `${path}/authenticate`,
      async (request: Request): Promise<RouterResponse> => ({
        status: 201,
        payload: await new UserController(
          this.repositoryFactory,
          this.hash,
          this.uuid,
        ).authenticateUser(request),
      }),
    )

    this.http.on(
      'post',
      `${path}/sessions/:refreshToken`,
      async (request: Request): Promise<RouterResponse> => ({
        status: 201,
        payload: await new UserTokenController(
          this.repositoryFactory,
          this.daoFactory,
        ).refreshUserToken(request),
      }),
    )

    this.http.on(
      'get',
      `${path}/sessions`,
      isUser(),
      async (request: Request): Promise<RouterResponse> => ({
        status: 200,
        payload: await new UserTokenController(
          this.repositoryFactory,
          this.daoFactory,
        ).getUserTokens(request),
      }),
    )

    this.http.on(
      'delete',
      `${path}/sessions/:refreshToken/token`,
      async (request: Request): Promise<RouterResponse> => {
        return {
          status: 204,
          payload: await new UserTokenController(
            this.repositoryFactory,
            this.daoFactory,
          ).deleteUserToken(request),
        }
      },
    )

    this.http.on(
      'delete',
      `${path}/sessions/:id/id`,
      isUser(),
      async (request: Request): Promise<RouterResponse> => {
        return {
          status: 204,
          payload: await new UserTokenController(
            this.repositoryFactory,
            this.daoFactory,
          ).deleteUserToken(request),
        }
      },
    )
  }
}
