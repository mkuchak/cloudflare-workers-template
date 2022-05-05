import { PrismaClient } from '@prisma/client'

import { UserToken } from '@/domain/entity/UserToken'
import { UserTokenRepository } from '@/domain/repository/UserTokenRepository'

import { DataProxyPrismaClient } from '..'

export class UserTokenRepositoryPrisma implements UserTokenRepository {
  constructor(readonly client = DataProxyPrismaClient || new PrismaClient()) {}

  async save(userToken: UserToken): Promise<void> {
    await this.client.userToken.upsert({
      where: {
        id: userToken.id,
      },
      update: userToken,
      create: userToken,
    })
  }

  async findByToken(token: string): Promise<UserToken> {
    const userToken = await this.client.userToken.findFirst({
      where: {
        token,
      },
    })

    return userToken && new UserToken(userToken)
  }

  async findById(id: string): Promise<UserToken> {
    const userToken = await this.client.userToken.findFirst({
      where: {
        id,
      },
    })

    return userToken && new UserToken(userToken)
  }
}
