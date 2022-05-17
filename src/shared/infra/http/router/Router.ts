import { DAOFactory } from '@/application/factory/DAOFactory'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
import { HttpError } from '@/shared/error/HttpError'

import { Http } from '../Http'
import { AuthenticationRouter } from './AuthenticationRouter'
import { AuthorizationRouter } from './AuthorizationRouter'
import { UsersRouter } from './UsersRouter'

export interface RouterResponse {
  status: number
  redirect?: string
  headers?: any
  cookies?: any
  payload?: any
  cache?: number
}

export class Router {
  authenticationRouter: AuthenticationRouter
  authorizationRouter: AuthorizationRouter
  usersRouter: UsersRouter

  constructor(readonly http: Http, readonly repositoryFactory: RepositoryFactory, readonly daoFactory: DAOFactory) {
    this.authenticationRouter = new AuthenticationRouter(this.http, this.repositoryFactory, this.daoFactory)
    this.authorizationRouter = new AuthorizationRouter(this.http, this.repositoryFactory, this.daoFactory)
    this.usersRouter = new UsersRouter(this.http, this.repositoryFactory, this.daoFactory)
  }

  init(path: string = '') {
    this.authenticationRouter.init(`${path}`)
    this.authorizationRouter.init(`${path}`)
    this.usersRouter.init(`${path}/users`)

    this.http.join('*', () => {
      throw new HttpError('Not Found', 404)
    })
  }

  static parsePath(path: string): any {
    const paths = []
    let current = path
    while (current) {
      paths.push(current)
      current = current.split('/').slice(0, -1).join('/')
    }
    return paths
  }
}
