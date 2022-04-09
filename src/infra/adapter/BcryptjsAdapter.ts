import { compare, hash } from 'bcryptjs'

import { CryptoAdapter } from '@/application/adapter/CryptoAdapter'

export class BcryptjsAdapter implements CryptoAdapter {
  async hash (value: string): Promise<string> {
    return await hash(value, 10)
  }

  async compare (value: string, hash: string): Promise<boolean> {
    return await compare(value, hash)
  }
}
