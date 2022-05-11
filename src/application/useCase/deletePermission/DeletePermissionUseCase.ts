import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
import { PermissionRepository } from '@/domain/repository/PermissionRepository'
import { AppError } from '@/shared/error/AppError'
import { RepositoryFactoryPrisma } from '@/shared/infra/factory/RepositoryFactoryPrisma'

import { DeletePermissionInputDTO } from './DeletePermissionInputDTO'

export class DeletePermissionUseCase {
  permissionRepository: PermissionRepository

  constructor(readonly repositoryFactory: RepositoryFactory = new RepositoryFactoryPrisma()) {
    this.permissionRepository = repositoryFactory.createPermissionRepository()
  }

  async execute(input: DeletePermissionInputDTO): Promise<void> {
    const permissionExists = !!(await this.permissionRepository.findById(input.id))

    if (!permissionExists) {
      throw new AppError('Permission Inexistent', 404)
    }

    await this.permissionRepository.deleteById(input.id)
  }
}
