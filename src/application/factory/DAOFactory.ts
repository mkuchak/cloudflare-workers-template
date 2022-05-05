import { UserDAO } from '../dao/UserDAO'
import { UserTokenDAO } from '../dao/UserTokenDAO'

export interface DAOFactory {
  createUserDAO(): UserDAO
  createUserTokenDAO(): UserTokenDAO
}
