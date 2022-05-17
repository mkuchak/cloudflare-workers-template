import { Permission } from '@/domain/entity/Permission'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
import { PermissionRepository } from '@/domain/repository/PermissionRepository'
import { HttpError } from '@/shared/error/HttpError'
import { RepositoryFactoryPrisma } from '@/shared/infra/factory/RepositoryFactoryPrisma'

import { CreatePermissionInputDTO } from './CreatePermissionInputDTO'
import { CreatePermissionOutputDTO } from './CreatePermissionOutputDTO'

export class CreatePermissionUseCase {
  permissionRepository: PermissionRepository

  constructor(readonly repositoryFactory: RepositoryFactory = new RepositoryFactoryPrisma()) {
    this.permissionRepository = repositoryFactory.createPermissionRepository()
  }

  async execute(input: CreatePermissionInputDTO): Promise<CreatePermissionOutputDTO> {
    const permissionExists = !!(await this.permissionRepository.findByLabel(input.label))

    if (permissionExists) {
      throw new HttpError('Permission Already Exists', 409)
    }

    const permission = new Permission(input)

    await this.permissionRepository.save(permission)

    return {
      id: permission.id,
      label: permission.label,
    }
  }
}
