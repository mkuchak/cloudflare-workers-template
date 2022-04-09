import { PrismaClient } from '@prisma/client'

import { User } from '@/domain/entity/User'
import { UserRepository } from '@/domain/repository/UserRepository'

export class UserRepositoryPrisma implements UserRepository {
  constructor (private readonly prisma = new PrismaClient()) {}

  async save (user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: {
        id: user.id,
      },
      update: user,
      create: user,
    })
  }

  async findById (id: string): Promise<User> {
    return await this.prisma.user.findFirst({
      where: {
        id,
      },
    })
  }

  async findByEmail (email: string): Promise<User> {
    return await this.prisma.user.findFirst({
      where: {
        email,
      },
    })
  }
}
