import { PrismaClient } from '@prisma/client'

import { Token } from '@/domain/entity/Token'
import { TokenRepository } from '@/domain/repository/TokenRepository'

import { DataProxyPrismaClient } from '..'

export class TokenRepositoryPrisma implements TokenRepository {
  constructor(readonly client = DataProxyPrismaClient || new PrismaClient()) {}

  async save(token: Token): Promise<void> {
    await this.client.token.upsert({
      where: {
        id: token.id,
      },
      update: token,
      create: token,
    })
  }

  async findByToken(value: string): Promise<Token> {
    const token = await this.client.token.findFirst({
      where: {
        value,
      },
    })

    return token && new Token(token)
  }

  async findById(id: string): Promise<Token> {
    const token = await this.client.token.findFirst({
      where: {
        id,
      },
    })

    return token && new Token(token)
  }
}
