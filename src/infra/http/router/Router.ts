import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
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
  ) {}

  init (path: string = '') {
    const authenticationRouter = new AuthenticationRouter(
      this.http,
      this.repositoryFactory,
    )

    authenticationRouter.init(`${path}/account`)

    this.http.join('*', () => {
      throw new AppError('Not Found', 404)
    })
  }
}
