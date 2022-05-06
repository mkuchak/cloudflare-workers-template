import { Token } from '../entity/Token'

export interface TokenRepository {
  save(token: Token): Promise<void>
  findByToken(value: string): Promise<Token>
  findById(id: string): Promise<Token>
}
