import { HttpError } from '@/shared/error/HttpError'
import { ProviderFactory } from '@/shared/infra/factory/ProviderFactory'
import { Hash } from '@/shared/provider/Hash/Hash'

export class Password {
  private password: string

  constructor(password: string) {
    if (!this.isSecure(password)) {
      throw new HttpError('Weak Password', 400)
    }

    this.password = password
  }

  public getValue(): string {
    return this.password
  }

  private isSecure(password: string): boolean {
    /**
     * At least 8 characters
     * At least one lowercase letter
     * At least one uppercase letter
     * At least one number
     * At least one special character
     */
    return !!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/)
  }

  async isValid(password: string, hash: Hash = new ProviderFactory().createHashProvider()): Promise<boolean> {
    return await hash.compare(password, this.password)
  }

  async hash(hash: Hash = new ProviderFactory().createHashProvider()): Promise<void> {
    this.password = await hash.generate(this.password)
  }
}
