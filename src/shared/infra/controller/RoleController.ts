import { DAOFactory } from '@/application/factory/DAOFactory'
import { ListRolesQuery } from '@/application/query/listRoles/ListRolesQuery'
import { CreateRBACUseCase } from '@/application/useCase/createRBAC/CreateRBACUseCase'
import { CreateRoleUseCase } from '@/application/useCase/createRole/CreateRoleUseCase'
import { DeleteRBACUseCase } from '@/application/useCase/deleteRBAC/DeleteRBACUseCase'
import { DeleteRoleUseCase } from '@/application/useCase/deleteRole/DeleteRoleUseCase'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'

export class RoleController {
  constructor(readonly repositoryFactory: RepositoryFactory, readonly daoFactory: DAOFactory) {}

  async listRoles(request: Request) {
    const listRolesQuery = new ListRolesQuery(this.daoFactory)

    const output = await listRolesQuery.execute()

    return output
  }

  async createRole(request: Request) {
    const input = {
      label: request.content?.label,
      title: request.content?.title,
      description: request.content?.description,
    }

    const createRoleUseCase = new CreateRoleUseCase(this.repositoryFactory)

    const output = await createRoleUseCase.execute(input)

    return output
  }

  async deleteRole(request: Request) {
    const input = {
      id: request.params.id,
    }

    const deleteRoleUseCase = new DeleteRoleUseCase(this.repositoryFactory)

    await deleteRoleUseCase.execute(input)
  }

  async createRBAC(request: Request) {
    const input = {
      id: request.params.id,
      permissions: request.content || [],
    }

    const createRBACUseCase = new CreateRBACUseCase(this.repositoryFactory)

    await createRBACUseCase.execute(input)
  }

  async deleteRBAC(request: Request) {
    const input = {
      id: request.params.id,
      permissions: request.content || [],
    }

    const deleteRBACUseCase = new DeleteRBACUseCase(this.repositoryFactory)

    await deleteRBACUseCase.execute(input)
  }
}
