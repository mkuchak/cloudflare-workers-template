import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
import { PermissionRepository } from '@/domain/repository/PermissionRepository'
import { RoleRepository } from '@/domain/repository/RoleRepository'
import { UserRepository } from '@/domain/repository/UserRepository'
import { HttpError } from '@/shared/error/HttpError'
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
      throw new HttpError('User Inexistent', 404)
    }

    if (!input.roles.length && !input.permissions.length) {
      throw new HttpError('Role Or Permission Inexistent', 404)
    }

    for (const role of input.roles) {
      const roleExists = role.id
        ? await this.roleRepository.findById(role.id)
        : await this.roleRepository.findByLabel(role.label)

      if (!roleExists) {
        throw new HttpError('Role Inexistent', 404)
      }

      user.addRole(roleExists)
    }

    for (const permission of input.permissions) {
      const permissionExists = permission.id
        ? await this.permissionRepository.findById(permission.id)
        : await this.permissionRepository.findByLabel(permission.label)

      if (!permissionExists) {
        throw new HttpError('Permission Inexistent', 404)
      }

      user.addPermission(permissionExists)
    }

    await this.userRepository.save(user)
  }
}
