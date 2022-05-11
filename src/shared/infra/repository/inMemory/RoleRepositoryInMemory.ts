import { Role } from '@prisma/client'

import { RoleRepository } from '@/domain/repository/RoleRepository'

export class RoleRepositoryInMemory implements RoleRepository {
  private static instance: RoleRepositoryInMemory

  constructor(private role: Role[] = []) {
    if (!RoleRepositoryInMemory.instance) {
      RoleRepositoryInMemory.instance = this
    }

    return RoleRepositoryInMemory.instance
  }

  async save(role: Role): Promise<void> {
    this.role.push(role)
  }

  async findById(id: string): Promise<Role> {
    return this.role.find((role) => role.id === id)
  }

  async findByLabel(label: string): Promise<Role> {
    return this.role.find((role) => role.label === label)
  }

  async deleteById(id: string): Promise<void> {
    this.role = this.role.filter((role) => role.id !== id)
  }
}
