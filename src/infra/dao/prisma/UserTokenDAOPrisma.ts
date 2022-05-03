import { PrismaClient } from '@prisma/client'

import { UserTokenDAO } from '@/application/dao/UserTokenDAO'
import { GetUserTokensOutputDTO } from '@/application/query/getUserTokens/GetUserTokensOutputDTO'
import { DataProxyPrismaClient } from '@/infra/repository/prisma'

export class UserTokenDAOPrisma implements UserTokenDAO {
  constructor (readonly client = DataProxyPrismaClient || new PrismaClient()) {}

  async findByUserId (userId: string): Promise<GetUserTokensOutputDTO[]> {
    return await this.client.userToken.findMany({
      select: {
        id: true,
        userAgent: true,
        lastIp: true,
        asOrganization: true,
        timezone: true,
        continent: true,
        country: true,
        region: true,
        regionCode: true,
        city: true,
        postalCode: true,
        longitude: true,
        latitude: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        userId,
        isEmailToken: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }
}
