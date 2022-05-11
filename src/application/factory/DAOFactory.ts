import { PermissionDAO } from '../dao/PermissionDAO'
import { RoleDAO } from '../dao/RoleDAO'
import { TokenDAO } from '../dao/TokenDAO'
import { UserDAO } from '../dao/UserDAO'

export interface DAOFactory {
  createUserDAO(): UserDAO
  createTokenDAO(): TokenDAO
  createRoleDAO(): RoleDAO
  createPermissionDAO(): PermissionDAO
}
