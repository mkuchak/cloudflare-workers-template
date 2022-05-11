import { PrismaClient } from '@prisma/client'

import { Permission } from '@/domain/entity/Permission'
import { PermissionRepository } from '@/domain/repository/PermissionRepository'

import { DataProxyPrismaClient } from '..'

export class PermissionRepositoryPrisma implements PermissionRepository {
  constructor(readonly client = DataProxyPrismaClient || new PrismaClient()) {}

  async save(permission: Permission): Promise<void> {
    await this.client.permission.upsert({
      where: {
        id: permission.id,
      },
      update: permission,
      create: permission,
    })
  }

  async findById(id: string): Promise<Permission> {
    const permission = await this.client.permission.findFirst({
      where: {
        id,
      },
    })

    return permission && new Permission(permission)
  }

  async findByLabel(label: string): Promise<Permission> {
    const permission = await this.client.permission.findFirst({
      where: {
        label,
      },
    })

    return permission && new Permission(permission)
  }

  async deleteById(id: string): Promise<void> {
    await this.client.permission.delete({
      where: {
        id,
      },
    })
  }
}
