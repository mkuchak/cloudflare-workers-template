import { TokenDAO } from '../dao/TokenDAO'
import { UserDAO } from '../dao/UserDAO'

export interface DAOFactory {
  createUserDAO(): UserDAO
  createTokenDAO(): TokenDAO
}
