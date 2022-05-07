import { Token } from '@/domain/entity/Token'
import { TokenRepository } from '@/domain/repository/TokenRepository'

export class TokenRepositoryInMemory implements TokenRepository {
  private static instance: TokenRepositoryInMemory

  constructor(private token: Token[] = []) {
    if (!TokenRepositoryInMemory.instance) {
      TokenRepositoryInMemory.instance = this
    }

    return TokenRepositoryInMemory.instance
  }

  async save(token: Token): Promise<void> {
    this.token.push(token)
  }

  async findByToken(value: string): Promise<Token> {
    return this.token.find((token) => token.value === value)
  }

  async findById(id: string): Promise<Token> {
    return this.token.find((token) => token.id === id)
  }
}
