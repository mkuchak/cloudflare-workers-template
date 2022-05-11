import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
import { RoleRepository } from '@/domain/repository/RoleRepository'
import { AppError } from '@/shared/error/AppError'
import { RepositoryFactoryPrisma } from '@/shared/infra/factory/RepositoryFactoryPrisma'

import { DeleteRoleInputDTO } from './DeleteRoleInputDTO'

export class DeleteRoleUseCase {
  roleRepository: RoleRepository

  constructor(readonly repositoryFactory: RepositoryFactory = new RepositoryFactoryPrisma()) {
    this.roleRepository = repositoryFactory.createRoleRepository()
  }

  async execute(input: DeleteRoleInputDTO): Promise<void> {
    const roleExists = !!(await this.roleRepository.findById(input.id))

    if (!roleExists) {
      throw new AppError('Role Inexistent', 404)
    }

    await this.roleRepository.deleteById(input.id)
  }
}
