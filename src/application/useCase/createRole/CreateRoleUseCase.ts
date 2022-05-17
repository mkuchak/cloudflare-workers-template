import { Role } from '@/domain/entity/Role'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'
import { RoleRepository } from '@/domain/repository/RoleRepository'
import { HttpError } from '@/shared/error/HttpError'
import { RepositoryFactoryPrisma } from '@/shared/infra/factory/RepositoryFactoryPrisma'

import { CreateRoleInputDTO } from './CreateRoleInputDTO'
import { CreateRoleOutputDTO } from './CreateRoleOutputDTO'

export class CreateRoleUseCase {
  roleRepository: RoleRepository

  constructor(readonly repositoryFactory: RepositoryFactory = new RepositoryFactoryPrisma()) {
    this.roleRepository = repositoryFactory.createRoleRepository()
  }

  async execute(input: CreateRoleInputDTO): Promise<CreateRoleOutputDTO> {
    const roleExists = !!(await this.roleRepository.findByLabel(input.label))

    if (roleExists) {
      throw new HttpError('Role Already Exists', 409)
    }

    const role = new Role(input)

    await this.roleRepository.save(role)

    return {
      id: role.id,
      label: role.label,
    }
  }
}
