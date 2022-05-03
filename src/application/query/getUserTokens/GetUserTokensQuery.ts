import { UserTokenDAO } from '@/application/dao/UserTokenDAO'
import { DAOFactory } from '@/application/factory/DAOFactory'
import { Country } from '@/domain/entity/Country'
import { UserAgent } from '@/domain/entity/UserAgent'
import { DAOFactoryPrisma } from '@/infra/factory/DAOFactoryPrisma'

import { GetUserTokensInputDTO } from './GetUserTokensInputDTO'
import { GetUserTokensOutputDTO } from './GetUserTokensOutputDTO'

export class GetUserTokensQuery {
  userTokenDAO: UserTokenDAO;

  constructor (readonly daoFactory: DAOFactory = new DAOFactoryPrisma()) {
    this.userTokenDAO = daoFactory.createUserTokenDAO()
  }

  async execute (input: GetUserTokensInputDTO): Promise<GetUserTokensOutputDTO[]> {
    const userTokens = await this.userTokenDAO.findByUserId(input.userId)

    for (const userToken of userTokens) {
      userToken.userAgent = new UserAgent(userToken.userAgent as string)
      userToken.country = new Country(userToken.country as string)
    }

    return userTokens
  }
}
