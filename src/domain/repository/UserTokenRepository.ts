import { UserToken } from '../entity/UserToken'

export interface UserTokenRepository {
  save(userToken: UserToken): Promise<void>;
  findByToken(token: string): Promise<UserToken>;
  findById(id: string): Promise<UserToken>;
}
