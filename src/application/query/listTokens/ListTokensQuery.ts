import { TokenDAO } from '@/application/dao/TokenDAO'
import { DAOFactory } from '@/application/factory/DAOFactory'
import { Country } from '@/domain/entity/Country'
import { UserAgent } from '@/domain/entity/UserAgent'
import { DAOFactoryPrisma } from '@/infra/factory/DAOFactoryPrisma'

import { ListTokensInputDTO } from './ListTokensInputDTO'
import { ListTokensOutputDTO } from './ListTokensOutputDTO'

export class ListTokensQuery {
  tokenDAO: TokenDAO

  constructor(readonly daoFactory: DAOFactory = new DAOFactoryPrisma()) {
    this.tokenDAO = daoFactory.createTokenDAO()
  }

  async execute(input: ListTokensInputDTO): Promise<ListTokensOutputDTO[]> {
    const tokens = await this.tokenDAO.findByUserId(input.userId)

    for (const token of tokens) {
      token.userAgent = new UserAgent(token.userAgent as string)
      token.country = new Country(token.country as string)
    }

    return tokens
  }
}
