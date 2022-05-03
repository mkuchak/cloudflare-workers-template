import { UserTokenDAO } from '../dao/UserTokenDAO'

export interface DAOFactory {
  createUserTokenDAO(): UserTokenDAO;
}
