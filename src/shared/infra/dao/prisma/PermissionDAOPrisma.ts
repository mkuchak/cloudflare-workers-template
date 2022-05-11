import { PrismaClient } from '@prisma/client'

import { PermissionDAO } from '@/application/dao/PermissionDAO'

import { DataProxyPrismaClient } from '../../repository/prisma'

export class PermissionDAOPrisma implements PermissionDAO {
  constructor(readonly client = DataProxyPrismaClient || new PrismaClient()) {}

  async findAll(): Promise<any> {
    return this.client.permission.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
  }
}
