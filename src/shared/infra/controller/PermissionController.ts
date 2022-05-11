import { DAOFactory } from '@/application/factory/DAOFactory'
import { ListPermissionsQuery } from '@/application/query/listPermissions/ListPermissionsQuery'
import { CreatePermissionUseCase } from '@/application/useCase/createPermission/CreatePermissionUseCase'
import { DeletePermissionUseCase } from '@/application/useCase/deletePermission/DeletePermissionUseCase'
import { RepositoryFactory } from '@/domain/factory/RepositoryFactory'

export class PermissionController {
  constructor(readonly repositoryFactory: RepositoryFactory, readonly daoFactory: DAOFactory) {}

  async listPermissions(request: Request) {
    const listPermissionsQuery = new ListPermissionsQuery(this.daoFactory)

    const output = await listPermissionsQuery.execute()

    return output
  }

  async createPermission(request: Request) {
    const input = {
      label: request.content?.label,
      title: request.content?.title,
      description: request.content?.description,
    }

    const createPermissionUseCase = new CreatePermissionUseCase(this.repositoryFactory)

    const output = await createPermissionUseCase.execute(input)

    return output
  }

  async deletePermission(request: Request) {
    const input = {
      id: request.params.id,
    }

    const deletePermissionUseCase = new DeletePermissionUseCase(this.repositoryFactory)

    await deletePermissionUseCase.execute(input)
  }
}
