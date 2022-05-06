import { PrismaClient } from '@prisma/client'

import { TokenDAO } from '@/application/dao/TokenDAO'
import { ListTokensOutputDTO } from '@/application/query/listTokens/ListTokensOutputDTO'
import { DataProxyPrismaClient } from '@/infra/repository/prisma'

export class TokenDAOPrisma implements TokenDAO {
  constructor(readonly client = DataProxyPrismaClient || new PrismaClient()) {}

  async findByUserId(userId: string, isEmailToken = false, isValid = true): Promise<ListTokensOutputDTO[]> {
    const findValid = isValid && {
      expiresAt: {
        gt: new Date(),
      },
    }

    return await this.client.token.findMany({
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
        isEmailToken,
        ...findValid,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }
}
