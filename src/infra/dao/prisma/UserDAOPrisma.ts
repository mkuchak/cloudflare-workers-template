import { PrismaClient } from '@prisma/client'

import { UserDAO } from '@/application/dao/UserDAO'
import { DataProxyPrismaClient } from '@/infra/repository/prisma'

export class UserDAOPrisma implements UserDAO {
  constructor(readonly client = DataProxyPrismaClient || new PrismaClient()) {}

  // Consider refactoring and applying cursor-based pagination for scale/performance
  async findAll(page: number, records: number, order: 'desc' | 'asc'): Promise<any> {
    const users = await this.client.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        picture: true,
        isEmailVerified: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        role: {
          select: {
            label: true,
            permission: {
              select: {
                label: true,
              },
            },
          },
        },
        permission: {
          select: {
            label: true,
          },
        },
      },
      orderBy: {
        createdAt: order,
      },
      skip: (page - 1) * records,
      take: records,
    })

    const total = await this.client.user.count()

    return {
      data: users,
      totalRecords: total,
      totalPages: Math.ceil(total / records),
      currentPage: page,
    }
  }
}
