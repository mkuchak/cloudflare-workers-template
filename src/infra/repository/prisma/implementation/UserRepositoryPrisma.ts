import { PrismaClient } from '@prisma/client'

import { User } from '@/domain/entity/User'
import { UserRepository } from '@/domain/repository/UserRepository'

export class UserRepositoryPrisma implements UserRepository {
  constructor (readonly client = new PrismaClient()) {}

  async save (user: User): Promise<void> {
    await this.client.user.upsert({
      where: {
        id: user.id,
      },
      update: user,
      create: user,
    })
  }

  async findById (id: string): Promise<User> {
    return await this.client.user.findFirst({
      where: {
        id,
      },
    })
  }

  async findByEmail (email: string): Promise<User> {
    return await this.client.user.findFirst({
      where: {
        email,
      },
    })
  }
}
