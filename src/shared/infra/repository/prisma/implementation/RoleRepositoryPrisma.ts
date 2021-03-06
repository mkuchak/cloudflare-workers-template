import { PrismaClient } from '@prisma/client'

import { Permission } from '@/domain/entity/Permission'
import { Role } from '@/domain/entity/Role'
import { RoleRepository } from '@/domain/repository/RoleRepository'

import { DataProxyPrismaClient } from '..'

export class RoleRepositoryPrisma implements RoleRepository {
  constructor(readonly client = DataProxyPrismaClient || new PrismaClient()) {}

  async save(role: Role): Promise<void> {
    const { permission, ...restRole } = role

    const permissions = permission?.map((permission) =>
      permission.id ? { id: permission.id } : { label: permission.label },
    )

    await this.client.role.upsert({
      where: {
        id: role.id,
      },
      update: {
        ...restRole,
        permission: {
          set: permissions,
        },
      },
      create: {
        ...restRole,
        permission: {
          connect: permissions,
        },
      },
    })
  }

  async findById(id: string): Promise<Role> {
    const role = await this.client.role.findFirst({
      where: {
        id,
      },
      include: {
        permission: true,
      },
    })

    if (!role) return

    const { permission, ...restRole } = role

    return new Role({
      ...restRole,
      permission: permission?.map((permission) => new Permission(permission)),
    })
  }

  async findByLabel(label: string): Promise<Role> {
    const role = await this.client.role.findFirst({
      where: {
        label,
      },
      include: {
        permission: true,
      },
    })

    if (!role) return

    const { permission, ...restRole } = role

    return new Role({
      ...restRole,
      permission: permission?.map((permission) => new Permission(permission)),
    })
  }

  async deleteById(id: string): Promise<void> {
    await this.client.role.delete({
      where: {
        id,
      },
    })
  }
}
