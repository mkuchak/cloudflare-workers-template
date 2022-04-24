import { BcryptjsAdapter } from '@/infra/adapter/crypto/BcryptjsAdapter'
import { Crypto } from '@/infra/adapter/crypto/Crypto'
import { NanoidAdapter } from '@/infra/adapter/uuid/NanoidAdapter'
import { UUID } from '@/infra/adapter/uuid/UUID'
import { APIError } from '@/infra/error/APIError'

export class User {
  id?: string;
  email: string;
  password: string;
  name?: string;
  picture?: string;
  emailVerified?: boolean = false;
  createdAt?: Date = new Date();
  updatedAt?: Date = new Date();

  constructor (user: PickProps<User>, uuid: UUID = new NanoidAdapter()) {
    Object.assign(this, user)
    this.id = user.id ?? uuid.generate()
    this.email = this.validateEmail() && user.email.trim().toLowerCase()
    this.name = this.capitalize(user.name)
  }

  get firstName (): string {
    return this.name?.split(' ')[0] || null
  }

  get middleName (): string {
    return this.name?.split(' ').slice(1, -1).join(' ') || null
  }

  get lastName (): string {
    const splittedName = this.name?.split(' ')

    return splittedName?.length >= 2 ? splittedName.slice(-1)[0] : null
  }

  get nameInitials (): string {
    const [firstLetter, secondLetter] = [
      this.firstName?.charAt(0) || '',
      this.lastName?.charAt(0) || '',
    ]

    return (firstLetter + secondLetter).toUpperCase() || null
  }

  private capitalize (text: string): string {
    return text
      ? text
        .trim()
        .toLowerCase()
        .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()))
      : undefined
  }

  private validateEmail (): boolean {
    // Allow only alphanumeric characters, plus -_.
    // Forbid the use of alias with +
    // At least one letter before the @
    // At least one letter before and after .
    if (
      !this.email.trim().match(/^([a-z0-9_.-])+@([\da-z.-]+)\.([a-z.]{2,6})$/i)
    ) {
      throw new APIError(400, 'Invalid Email')
    }

    return true
  }

  validatePassword (): boolean {
    // At least 8 characters
    // At least one uppercase letter
    // At least one number
    // At least one special character
    return !!this.password.match(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$/,
    )
  }

  async checkPassword (
    password: string,
    crypto: Crypto = new BcryptjsAdapter(),
  ): Promise<boolean> {
    return await crypto.compare(password, this.password)
  }

  async hashPassword (crypto: Crypto = new BcryptjsAdapter()): Promise<void> {
    this.password = await crypto.hash(this.password)
  }
}
