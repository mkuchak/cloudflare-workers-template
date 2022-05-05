import { DAOFactory } from '@/application/factory/DAOFactory'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
import { BcryptjsHashAdapter } from '@/infra/adapter/hash/BcryptjsHashAdapter'
import { Hash } from '@/infra/adapter/hash/Hash'
import { NanoidAdapter } from '@/infra/adapter/uuid/NanoidAdapter'
import { UUID } from '@/infra/adapter/uuid/UUID'
import { AppError } from '@/infra/error/AppError'

import { Http } from '../Http'
import { AccountRouter } from './AccountRouter'
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
  accountRouter: AccountRouter
  usersRouter: UsersRouter

  constructor(
    readonly http: Http,
    readonly repositoryFactory: RepositoryFactory,
    readonly daoFactory: DAOFactory,
    readonly hash: Hash = new BcryptjsHashAdapter(),
    readonly uuid: UUID = new NanoidAdapter(),
  ) {
    this.accountRouter = new AccountRouter(this.http, this.repositoryFactory, this.daoFactory, this.hash, this.uuid)
    this.usersRouter = new UsersRouter(this.http, this.repositoryFactory, this.daoFactory, this.hash, this.uuid)
  }

  init(path: string = '') {
    this.accountRouter.init(`${path}/account`)
    this.usersRouter.init(`${path}/users`)

    this.http.join('*', () => {
      throw new AppError('Not Found', 404)
    })
  }
}
