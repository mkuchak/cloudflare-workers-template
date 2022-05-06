import { ListTokensOutputDTO } from '../query/listTokens/ListTokensOutputDTO'

export interface TokenDAO {
  findByUserId(userId: string, isEmailToken?: boolean, isValid?: boolean): Promise<ListTokensOutputDTO[]>
}
