import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
import { PermissionRepository } from '@/domain/repository/PermissionRepository'
import { RoleRepository } from '@/domain/repository/RoleRepository'
import { AppError } from '@/shared/error/AppError'
import { RepositoryFactoryPrisma } from '@/shared/infra/factory/RepositoryFactoryPrisma'

import { CreateRBACInputDTO } from './CreateRBACInputDTO'

export class CreateRBACUseCase {
  roleRepository: RoleRepository
  permissionRepository: PermissionRepository

  constructor(readonly repositoryFactory: RepositoryFactory = new RepositoryFactoryPrisma()) {
    this.roleRepository = repositoryFactory.createRoleRepository()
    this.permissionRepository = repositoryFactory.createPermissionRepository()
  }

  async execute(input: CreateRBACInputDTO): Promise<void> {
    const role = await this.roleRepository.findById(input.id)

    if (!role) {
      throw new AppError('Role Inexistent', 404)
    }

    if (!input.permissions.length) {
      throw new AppError('Permission Inexistent', 404)
    }

    const permissions = []

    for (const permission of input.permissions) {
      const permissionExists = permission.id
        ? await this.permissionRepository.findById(permission.id)
        : await this.permissionRepository.findByLabel(permission.label)

      if (!permissionExists) {
        throw new AppError('Permission Inexistent', 404)
      }

      permissions.push(permissionExists)
    }

    const permissionsLabels = []

    for (const permission of role.permission) {
      permissionsLabels.push(permission.label)
    }

    for (const permission of permissions) {
      if (!permissionsLabels.includes(permission.label)) {
        permissionsLabels.push(permission.label)
      }
    }

    role.permission = permissionsLabels.map((label) => ({ label }))

    await this.roleRepository.save(role)
  }
}
