import { PrismaClient } from '@prisma/client'

import { User } from '@/domain/entity/User'
import { UserRepository } from '@/domain/repository/UserRepository'

import { DataProxyPrismaClient } from '..'

export class UserRepositoryPrisma implements UserRepository {
  constructor (readonly client = DataProxyPrismaClient || new PrismaClient()) {}

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
    const user = await this.client.user.findFirst({
      where: {
        id,
      },
    })

    return user && new User(user)
  }

  async findByEmail (email: string): Promise<User> {
    const user = await this.client.user.findFirst({
      where: {
        email,
      },
    })

    return user && new User(user)
  }
}
