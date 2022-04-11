import { compare, hash } from 'bcryptjs'

import {
  CryptoAdapter,
  ICryptoAdapterOptions,
} from '@/application/adapter/CryptoAdapter'

export class BcryptjsAdapter implements CryptoAdapter {
  // @warning Salt rounds should be at least 6
  // Recommended is 10, but Workers have a CPU runtime limit of 10-50 ms
  // An alternative is to active Workers Unbound that can reach until 30 seconds
  async hash (value: string, options?: ICryptoAdapterOptions): Promise<string> {
    const salt = options?.saltRounds || 6

    return await hash(value, salt)
  }

  async compare (value: string, hash: string): Promise<boolean> {
    return await compare(value, hash)
  }
}
