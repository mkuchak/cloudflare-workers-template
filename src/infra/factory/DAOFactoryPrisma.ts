import type { PrismaClient } from '@prisma/client'

import { UserDAO } from '@/application/dao/UserDAO'
import { UserTokenDAO } from '@/application/dao/UserTokenDAO'
import { DAOFactory } from '@/application/factory/DAOFactory'

import { UserDAOPrisma } from '../dao/prisma/UserDAOPrisma'
import { UserTokenDAOPrisma } from '../dao/prisma/UserTokenDAOPrisma'

export class DAOFactoryPrisma implements DAOFactory {
  constructor(readonly client?: PrismaClient) {}

  createUserDAO(): UserDAO {
    return new UserDAOPrisma(this?.client)
  }

  createUserTokenDAO(): UserTokenDAO {
    return new UserTokenDAOPrisma(this?.client)
  }
}
