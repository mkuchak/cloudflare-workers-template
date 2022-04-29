import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
import { BcryptjsHashAdapter } from '@/infra/adapter/hash/BcryptjsHashAdapter'
import { Hash } from '@/infra/adapter/hash/Hash'
import { NanoidAdapter } from '@/infra/adapter/uuid/NanoidAdapter'
import { UUID } from '@/infra/adapter/uuid/UUID'
import { AppError } from '@/infra/error/AppError'

import { Http } from '../Http'
import { AuthenticationRouter } from './AuthenticationRouter'

export interface RouterResponse {
  status: number;
  redirect?: string;
  headers?: any;
  cookies?: any;
  payload?: any;
  cache?: number;
}

export class Router {
  constructor (
    readonly http: Http,
    readonly repositoryFactory: RepositoryFactory,
    readonly hash: Hash = new BcryptjsHashAdapter(),
    readonly uuid: UUID = new NanoidAdapter(),
  ) {}

  init (path: string = '') {
    const authenticationRouter = new AuthenticationRouter(
      this.http,
      this.repositoryFactory,
      this.hash,
      this.uuid,
    )

    authenticationRouter.init(`${path}/account`)

    this.http.join('*', () => {
      throw new AppError('Not Found', 404)
    })
  }
}
