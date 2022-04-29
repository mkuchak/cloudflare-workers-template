import { BcryptjsHashAdapter } from '@/infra/adapter/hash/BcryptjsHashAdapter'
import { Hash } from '@/infra/adapter/hash/Hash'
import { AppError } from '@/infra/error/AppError'

export class Password {
  private password: string;

  constructor (password: string) {
    if (!this.isSecure(password)) {
      throw new AppError('Weak Password', 400)
    }

    this.password = password
  }

  public getPassword (): string {
    return this.password
  }

  private isSecure (password: string): boolean {
    // At least 8 characters
    // At least one lowercase letter
    // At least one uppercase letter
    // At least one number
    // At least one special character
    return !!password.match(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/,
    )
  }

  static async isValid (
    password: string,
    hashedPassword: string,
    hash: Hash = new BcryptjsHashAdapter(),
  ): Promise<boolean> {
    return await hash.compare(password, hashedPassword)
  }

  static async hash (
    password: string,
    hash: Hash = new BcryptjsHashAdapter(),
  ): Promise<string> {
    return await hash.generate(password)
  }
}
