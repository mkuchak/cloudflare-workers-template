import { PrismaClient } from '@prisma/client'

import { UserToken } from '@/domain/entity/UserToken'

export class UserTokenRepositoryPrisma {
  constructor (readonly client = new PrismaClient()) {}

  async save (userToken: UserToken): Promise<void> {
    await this.client.userToken.upsert({
      where: {
        id: userToken.id,
      },
      update: userToken,
      create: userToken,
    })
  }

  async findByToken (token: string): Promise<UserToken> {
    const userToken = await this.client.userToken.findFirst({
      where: {
        token,
      },
    })

    return userToken && new UserToken(userToken)
  }
}
