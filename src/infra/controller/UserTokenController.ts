import { RefreshUserTokenUseCase } from '@/application/useCase/refreshUserToken/RefreshUserTokenUseCase'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'

export class UserTokenController {
  constructor (readonly repositoryFactory: RepositoryFactory) {}

  async refreshUserToken (request: Request) {
    const input = {
      refreshToken: request.params.refreshToken,
      lastIp:
        request.headers.get('cf-connecting-ip') ||
        request.headers.get('x-forwarded-for'),
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

    const refreshUserToken = new RefreshUserTokenUseCase(
      this.repositoryFactory,
    )

    const output = await refreshUserToken.execute(input)

    return output
  }
}
