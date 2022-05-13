import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
import { PermissionRepository } from '@/domain/repository/PermissionRepository'
import { RoleRepository } from '@/domain/repository/RoleRepository'
import { UserRepository } from '@/domain/repository/UserRepository'
import { AppError } from '@/shared/error/AppError'
import { RepositoryFactoryPrisma } from '@/shared/infra/factory/RepositoryFactoryPrisma'

import { DeleteUserRBACInputDTO } from './DeleteUserRBACInputDTO'

export class DeleteUserRBACUseCase {
  userRepository: UserRepository
  roleRepository: RoleRepository
  permissionRepository: PermissionRepository

  constructor(readonly repositoryFactory: RepositoryFactory = new RepositoryFactoryPrisma()) {
    this.userRepository = repositoryFactory.createUserRepository()
    this.roleRepository = repositoryFactory.createRoleRepository()
    this.permissionRepository = repositoryFactory.createPermissionRepository()
  }

  async execute(input: DeleteUserRBACInputDTO): Promise<void> {
    const user = await this.userRepository.findById(input.id)

    if (!user) {
      throw new AppError('User Inexistent', 404)
    }

    if (!input.roles.length && !input.permissions.length) {
      throw new AppError('Role Or Permission Inexistent', 404)
    }

    for (const role of input.roles) {
      const roleExists = role.id
        ? await this.roleRepository.findById(role.id)
        : await this.roleRepository.findByLabel(role.label)

      if (!roleExists) {
        throw new AppError('Role Inexistent', 404)
      }

      user.removeRole(roleExists)
    }

    for (const permission of input.permissions) {
      const permissionExists = permission.id
        ? await this.permissionRepository.findById(permission.id)
        : await this.permissionRepository.findByLabel(permission.label)

      if (!permissionExists) {
        throw new AppError('Permission Inexistent', 404)
      }

      user.removePermission(permissionExists)
    }

    await this.userRepository.save(user)
  }
}
