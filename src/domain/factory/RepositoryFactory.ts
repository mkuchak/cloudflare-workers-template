import { PermissionRepository } from '../repository/PermissionRepository'
import { RoleRepository } from '../repository/RoleRepository'
import { TokenRepository } from '../repository/TokenRepository'
import { UserRepository } from '../repository/UserRepository'

export interface RepositoryFactory {
  createUserRepository(): UserRepository
  createTokenRepository(): TokenRepository
  createRoleRepository(): RoleRepository
  createPermissionRepository(): PermissionRepository
}
