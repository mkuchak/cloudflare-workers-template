import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
import { CreateUserController } from '@/infra/controller/CreateUserController'

import { Http } from './Http'
import { ResponseError } from './response/ResponseError'

export class Router {
  constructor (
    readonly http: Http,
    readonly repositoryFactory: RepositoryFactory,
  ) {}

  init () {
    this.http.on(
      'post',
      '/users',
      new CreateUserController(this.repositoryFactory).handle,
    )

    this.http.join('*', () => {
      throw new ResponseError(404, 'Not Found')
    })
  }
}
