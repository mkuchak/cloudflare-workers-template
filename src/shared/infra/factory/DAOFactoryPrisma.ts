import type { PrismaClient } from '@prisma/client'

import { PermissionDAO } from '@/application/dao/PermissionDAO'
import { RoleDAO } from '@/application/dao/RoleDAO'
import { TokenDAO } from '@/application/dao/TokenDAO'
import { UserDAO } from '@/application/dao/UserDAO'
import { DAOFactory } from '@/application/factory/DAOFactory'

import { PermissionDAOPrisma } from '../dao/prisma/PermissionDAOPrisma'
import { RoleDAOPrisma } from '../dao/prisma/RoleDAOPrisma'
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

  createRoleDAO(): RoleDAO {
    return new RoleDAOPrisma(this?.client)
  }

  createPermissionDAO(): PermissionDAO {
    return new PermissionDAOPrisma(this?.client)
  }
}
