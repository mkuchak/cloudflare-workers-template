import { Permission } from '@prisma/client'

import { PermissionRepository } from '@/domain/repository/PermissionRepository'

export class PermissionRepositoryInMemory implements PermissionRepository {
  private static instance: PermissionRepositoryInMemory

  constructor(private permission: Permission[] = []) {
    if (!PermissionRepositoryInMemory.instance) {
      PermissionRepositoryInMemory.instance = this
    }

    return PermissionRepositoryInMemory.instance
  }

  async save(permission: Permission): Promise<void> {
    this.permission.push(permission)
  }

  async findById(id: string): Promise<Permission> {
    return this.permission.find((permission) => permission.id === id)
  }

  async findByLabel(label: string): Promise<Permission> {
    return this.permission.find((permission) => permission.label === label)
  }

  async deleteById(id: string): Promise<void> {
    this.permission = this.permission.filter((permission) => permission.id !== id)
  }
}
