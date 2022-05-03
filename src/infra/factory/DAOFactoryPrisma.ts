import type { PrismaClient } from '@prisma/client'

import { UserTokenDAO } from '@/application/dao/UserTokenDAO'
import { DAOFactory } from '@/application/factory/DAOFactory'

import { UserTokenDAOPrisma } from '../dao/prisma/UserTokenDAOPrisma'

export class DAOFactoryPrisma implements DAOFactory {
  constructor (readonly client?: PrismaClient) {}

  createUserTokenDAO (): UserTokenDAO {
    return new UserTokenDAOPrisma(this?.client)
  }
}
