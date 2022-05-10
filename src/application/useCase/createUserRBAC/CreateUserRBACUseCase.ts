import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
import { PermissionRepository } from '@/domain/repository/PermissionRepository'
import { RoleRepository } from '@/domain/repository/RoleRepository'
import { UserRepository } from '@/domain/repository/UserRepository'
import { AppError } from '@/shared/error/AppError'
import { RepositoryFactoryPrisma } from '@/shared/infra/factory/RepositoryFactoryPrisma'

import { CreateUserRBACInputDTO } from './CreateUserRBACInputDTO'

export class CreateUserRBACUseCase {
  userRepository: UserRepository
  roleRepository: RoleRepository
  permissionRepository: PermissionRepository

  constructor(readonly repositoryFactory: RepositoryFactory = new RepositoryFactoryPrisma()) {
    this.userRepository = repositoryFactory.createUserRepository()
    this.roleRepository = repositoryFactory.createRoleRepository()
    this.permissionRepository = repositoryFactory.createPermissionRepository()
  }

  async execute(input: CreateUserRBACInputDTO): Promise<void> {
    const user = await this.userRepository.findById(input.id)

    if (!user) {
      throw new AppError('User Inexistent', 400)
    }

    const roles = []

    for (const role of input.roles) {
      const roleExists = role.id
        ? await this.roleRepository.findById(role.id)
        : await this.roleRepository.findByLabel(role.label)

      if (!roleExists) {
        throw new AppError('Role Inexistent', 400)
      }

      roles.push(roleExists)
    }

    const permissions = []

    for (const permission of input.permissions) {
      const permissionExists = permission.id
        ? await this.permissionRepository.findById(permission.id)
        : await this.permissionRepository.findByLabel(permission.label)

      if (!permissionExists) {
        throw new AppError('Permission Inexistent', 400)
      }

      permissions.push(permissionExists)
    }

    const rolesLabels = []

    for (const role of user.role) {
      rolesLabels.push(role.label)
    }

    for (const role of roles) {
      if (!rolesLabels.includes(role.label)) {
        rolesLabels.push(role.label)
      }
    }

    const permissionsLabels = []

    for (const permission of user.permission) {
      permissionsLabels.push(permission.label)
    }

    for (const permission of permissions) {
      if (!permissionsLabels.includes(permission.label)) {
        permissionsLabels.push(permission.label)
      }
    }

    user.role = rolesLabels.map((label) => ({ label }))
    user.permission = permissionsLabels.map((label) => ({ label }))

    await this.userRepository.save(user)
  }
}
