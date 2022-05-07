import { compare, hash } from 'bcryptjs'

import { Hash, IHashOptions } from '../Hash'

export class BcryptjsHashProvider implements Hash {
  /**
   * @warning Salt rounds should be at least 6
   * Recommended is 10, but Workers have a CPU runtime limit of 10-50 ms
   * An alternative is to active Workers Unbound that can reach until 30 seconds
   */
  async generate(value: string, options?: IHashOptions): Promise<string> {
    const salt = options?.saltRounds || 6

    return await hash(value, salt)
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return await compare(value, hash)
  }
}
