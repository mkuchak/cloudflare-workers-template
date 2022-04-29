import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
import { BcryptjsHashAdapter } from '@/infra/adapter/hash/BcryptjsHashAdapter'
import { Hash } from '@/infra/adapter/hash/Hash'
import { NanoidAdapter } from '@/infra/adapter/uuid/NanoidAdapter'
import { UUID } from '@/infra/adapter/uuid/UUID'

import { UserController } from '../../controller/UserController'
import { UserTokenController } from '../../controller/UserTokenController'
import { Http } from '../Http'
import { RouterResponse } from './Router'

export class AuthenticationRouter {
  constructor (
    readonly http: Http,
    readonly repositoryFactory: RepositoryFactory,
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
      'put',
      `${path}/sessions/:refreshToken`,
      async (request: Request): Promise<RouterResponse> => ({
        status: 201,
        payload: await new UserTokenController(
          this.repositoryFactory,
        ).refreshUserToken(request),
      }),
    )

    this.http.on(
      // TODO: implement this
      'delete',
      `${path}/sessions/:refreshToken/token`,
      async (request: Request): Promise<RouterResponse> => {
        return {
          // status: 204, // No Content
          status: 202,
          payload: {
            // temporary fake response
            refreshToken: request.params.refreshToken,
          },
        }
      },
    )
    this.http.on(
      // TODO: implement this
      'delete',
      `${path}/sessions/:id/id`,
      async (request: Request): Promise<RouterResponse> => {
        return {
          // status: 204, // No Content
          status: 202,
          payload: {
            // temporary fake response
            id: request.params.id,
          },
        }
      },
    )
  }
}
