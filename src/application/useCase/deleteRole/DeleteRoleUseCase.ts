import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
import { RoleRepository } from '@/domain/repository/RoleRepository'
import { HttpError } from '@/shared/error/HttpError'
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
      throw new HttpError('Role Inexistent', 404)
    }

    await this.roleRepository.deleteById(input.id)
  }
}
