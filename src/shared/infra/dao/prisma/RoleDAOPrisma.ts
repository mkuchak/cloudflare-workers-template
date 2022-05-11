import { PrismaClient } from '@prisma/client'

import { RoleDAO } from '@/application/dao/RoleDAO'

import { DataProxyPrismaClient } from '../../repository/prisma'

export class RoleDAOPrisma implements RoleDAO {
  constructor(readonly client = DataProxyPrismaClient || new PrismaClient()) {}

  async findAll(): Promise<any> {
    return this.client.role.findMany({
      include: {
        permission: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }
}
