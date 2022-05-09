import { PrismaClient } from '@prisma/client'

import { User } from '@/domain/entity/User'
import { UserRepository } from '@/domain/repository/UserRepository'

import { DataProxyPrismaClient } from '..'

export class UserRepositoryPrisma implements UserRepository {
  constructor(readonly client = DataProxyPrismaClient || new PrismaClient()) {}

  async save(user: User): Promise<void> {
    const { role, permission, ...restUser } = user

    const roles = role.map((role) => (role.id ? { id: role.id } : { label: role.label }))
    const permissions = permission.map((permission) =>
      permission.id ? { id: permission.id } : { label: permission.label },
    )

    await this.client.user.upsert({
      where: {
        id: user.id,
      },
      update: {
        ...restUser,
        role: {
          set: roles,
        },
        permission: {
          set: permissions,
        },
      },
      create: {
        ...restUser,
        role: {
          connect: roles,
        },
        permission: {
          connect: permissions,
        },
      },
    })
  }

  async findById(id: string): Promise<User> {
    const user = await this.client.user.findFirst({
      where: {
        id,
      },
      include: {
        role: {
          select: {
            id: true,
            title: true,
            description: true,
            label: true,
            createdAt: true,
            updatedAt: true,
            permission: {
              select: { id: true, title: true, description: true, label: true, createdAt: true, updatedAt: true },
            },
          },
        },
        permission: {
          select: { id: true, title: true, description: true, label: true, createdAt: true, updatedAt: true },
        },
      },
    })

    return user && new User(user)
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.client.user.findFirst({
      where: {
        email,
      },
      include: {
        role: {
          select: {
            id: true,
            title: true,
            description: true,
            label: true,
            createdAt: true,
            updatedAt: true,
            permission: {
              select: { id: true, title: true, description: true, label: true, createdAt: true, updatedAt: true },
            },
          },
        },
        permission: {
          select: { id: true, title: true, description: true, label: true, createdAt: true, updatedAt: true },
        },
      },
    })

    return user && new User(user)
  }
}
