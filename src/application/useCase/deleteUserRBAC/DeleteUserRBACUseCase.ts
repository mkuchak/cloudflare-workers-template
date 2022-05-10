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

    const userRolesLabels = []

    for (const role of user.role) {
      userRolesLabels.push(role.label)
    }

    const deleteRolesLabels: string[] = []

    for (const role of roles) {
      if (!deleteRolesLabels.includes(role.label)) {
        deleteRolesLabels.push(role.label)
      }
    }

    const userPermissionsLabels = []

    for (const permission of user.permission) {
      userPermissionsLabels.push(permission.label)
    }

    const deletePermissionsLabels: string[] = []

    for (const permission of permissions) {
      if (!deletePermissionsLabels.includes(permission.label)) {
        deletePermissionsLabels.push(permission.label)
      }
    }

    user.role = userRolesLabels.filter((label) => !deleteRolesLabels.includes(label)).map((label) => ({ label }))
    user.permission = userPermissionsLabels
      .filter((label) => !deletePermissionsLabels.includes(label))
      .map((label) => ({ label }))

    await this.userRepository.save(user)
  }
}
