import { DAOFactory } from '@/application/factory/DAOFactory'
import { ListTokensQuery } from '@/application/query/listTokens/ListTokensQuery'
import { DeleteTokenUseCase } from '@/application/useCase/deleteToken/DeleteTokenUseCase'
import { RefreshTokenUseCase } from '@/application/useCase/refreshToken/RefreshTokenUseCase'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'

export class TokenController {
  constructor(readonly repositoryFactory: RepositoryFactory, readonly daoFactory: DAOFactory) {}

  async listTokens(request: Request) {
    const input = {
      userId: request.user?.id,
    }

    const listTokens = new ListTokensQuery(this.daoFactory)

    const output = await listTokens.execute(input)

    return output
  }

  async refreshToken(request: Request) {
    const input = {
      refreshToken: request.params.refreshToken,
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

    const refreshToken = new RefreshTokenUseCase(this.repositoryFactory)

    const output = await refreshToken.execute(input)

    return output
  }

  async deleteToken(request: Request) {
    const input = {
      userId: request.user?.id,
      id: request.params.id,
      refreshToken: request.params.refreshToken,
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

    const deleteToken = new DeleteTokenUseCase(this.repositoryFactory)

    await deleteToken.execute(input)
  }
}
