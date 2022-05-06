import { DAOFactory } from '@/application/factory/DAOFactory'
import { ListUsersQuery } from '@/application/query/listUsers/ListUsersQuery'
import { AuthenticateUserUseCase } from '@/application/useCase/authenticateUser/AuthenticateUserUseCase'
import { CreateUserUseCase } from '@/application/useCase/createUser/CreateUserUseCase'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'

import { BcryptjsHashAdapter } from '../adapter/hash/BcryptjsHashAdapter'
import { Hash } from '../adapter/hash/Hash'
import { NanoidAdapter } from '../adapter/uuid/NanoidAdapter'
import { UUID } from '../adapter/uuid/UUID'

export class UserController {
  constructor(
    readonly repositoryFactory: RepositoryFactory,
    readonly daoFactory: DAOFactory,
    readonly hash: Hash = new BcryptjsHashAdapter(),
    readonly uuid: UUID = new NanoidAdapter(),
  ) {}

  async createUser(request: Request) {
    const input = request.content

    const createUserUseCase = new CreateUserUseCase(this.repositoryFactory, this.hash, this.uuid)

    const output = await createUserUseCase.execute(input)

    return output
  }

  async authenticateUser(request: Request) {
    const input = {
      email: request.content.email.toLowerCase(),
      password: request.content.password,
      lastIp: request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
      asn: request.cf.asn,
      asOrganization: request.cf.asOrganization,
      timezone: request.cf.timezone,
      continent: request.cf.continent,
      country: request.cf.country,
      region: request.cf.region,
      regionCode: request.cf.regionCode,
      city: request.cf.city,
      postalCode: request.cf.postalCode,
      longitude: request.cf.longitude,
      latitude: request.cf.latitude,
    }

    const authenticateUserUseCase = new AuthenticateUserUseCase(this.repositoryFactory, this.hash, this.uuid)

    const output = await authenticateUserUseCase.execute(input)

    return output
  }

  async listUsers(request: Request) {
    const input = {
      page: Number(request.query.page) || 1,
      records: Number(request.query.records) || 10,
      order: request.query.order.includes('asc') ? 'asc' : 'desc',
    }

    const listUsers = new ListUsersQuery(this.daoFactory)

    const output = await listUsers.execute(input)

    return output
  }
}
