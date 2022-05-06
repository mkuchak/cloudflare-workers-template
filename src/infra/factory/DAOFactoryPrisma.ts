import type { PrismaClient } from '@prisma/client'

import { TokenDAO } from '@/application/dao/TokenDAO'
import { UserDAO } from '@/application/dao/UserDAO'
import { DAOFactory } from '@/application/factory/DAOFactory'

import { TokenDAOPrisma } from '../dao/prisma/TokenDAOPrisma'
import { UserDAOPrisma } from '../dao/prisma/UserDAOPrisma'

export class DAOFactoryPrisma implements DAOFactory {
  constructor(readonly client?: PrismaClient) {}

  createUserDAO(): UserDAO {
    return new UserDAOPrisma(this?.client)
  }

  createTokenDAO(): TokenDAO {
    return new TokenDAOPrisma(this?.client)
  }
}
