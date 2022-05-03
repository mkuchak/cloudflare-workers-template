import { GetUserTokensOutputDTO } from '../query/getUserTokens/GetUserTokensOutputDTO'

export interface UserTokenDAO {
  findByUserId(userId: string): Promise<GetUserTokensOutputDTO[]>;
}
