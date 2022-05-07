import { AppError } from '@/shared/error/AppError'

export class Email {
  private email: string

  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new AppError('Invalid Email', 400)
    }

    this.email = email
  }

  public getEmail(): string {
    return this.format(this.email)
  }

  private isValid(email: string): boolean {
    /**
     * Allow only alphanumeric characters, plus -_.
     * Forbid the use of alias with +
     * At least one letter before the @
     * At least one letter before and after .
     */
    return !!this.format(email)
      .trim()
      .match(/^([a-z0-9_.-])+@([\da-z.-]+)\.([a-z.]{2,6})$/i)
  }

  private format(email: string): string {
    return email.toLowerCase().trim()
  }
}
