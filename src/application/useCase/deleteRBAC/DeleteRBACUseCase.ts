import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
import { PermissionRepository } from '@/domain/repository/PermissionRepository'
import { RoleRepository } from '@/domain/repository/RoleRepository'
import { HttpError } from '@/shared/error/HttpError'
import { RepositoryFactoryPrisma } from '@/shared/infra/factory/RepositoryFactoryPrisma'

import { DeleteRBACInputDTO } from './DeleteRBACInputDTO'

export class DeleteRBACUseCase {
  roleRepository: RoleRepository
  permissionRepository: PermissionRepository

  constructor(readonly repositoryFactory: RepositoryFactory = new RepositoryFactoryPrisma()) {
    this.roleRepository = repositoryFactory.createRoleRepository()
    this.permissionRepository = repositoryFactory.createPermissionRepository()
  }

  async execute(input: DeleteRBACInputDTO): Promise<void> {
    const role = await this.roleRepository.findById(input.id)

    if (!role) {
      throw new HttpError('Role Inexistent', 404)
    }

    if (!input.permissions.length) {
      throw new HttpError('Permission Inexistent', 404)
    }

    for (const permission of input.permissions) {
      const permissionExists = permission.id
        ? await this.permissionRepository.findById(permission.id)
        : await this.permissionRepository.findByLabel(permission.label)

      if (!permissionExists) {
        throw new HttpError('Permission Inexistent', 404)
      }

      role.removePermission(permissionExists)
    }

    await this.roleRepository.save(role)
  }
}
