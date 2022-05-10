import { DAOFactory } from '@/application/factory/DAOFactory'
import { GetProfileQuery } from '@/application/query/getProfile/GetProfileQuery'
import { GetUserQuery } from '@/application/query/getUser/GetUserQuery'
import { ListUsersQuery } from '@/application/query/listUsers/ListUsersQuery'
import { AuthenticateUserUseCase } from '@/application/useCase/authenticateUser/AuthenticateUserUseCase'
import { CreateUserUseCase } from '@/application/useCase/createUser/CreateUserUseCase'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'

export class UserController {
  constructor(readonly repositoryFactory: RepositoryFactory, readonly daoFactory: DAOFactory) {}

  async createUser(request: Request) {
    const input = {
      email: request.content.email,
      password: request.content.password,
      name: request.content.name,
      picture: request.content.picture,
    }

    const createUserUseCase = new CreateUserUseCase(this.repositoryFactory)

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

    const authenticateUserUseCase = new AuthenticateUserUseCase(this.repositoryFactory)

    const output = await authenticateUserUseCase.execute(input)

    return output
  }

  async listUsers(request: Request) {
    const input = {
      page: Number(request.query.page) || 1,
      records: Number(request.query.records) || 10,
      order: request.query.order?.includes('asc') ? 'asc' : 'desc',
    }

    const listUsersQuery = new ListUsersQuery(this.daoFactory)

    const output = await listUsersQuery.execute(input)

    return output
  }

  async getProfile(request: Request) {
    const input = {
      id: request.user.id,
    }

    const getProfileQuery = new GetProfileQuery(this.daoFactory)

    const output = await getProfileQuery.execute(input)

    return output
  }

  async getUser(request: Request) {
    const input = {
      id: request.params.id,
    }

    const getUserQuery = new GetUserQuery(this.daoFactory)

    const output = await getUserQuery.execute(input)

    return output
  }
}
