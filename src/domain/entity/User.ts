import { ProviderFactory } from '@/shared/infra/factory/ProviderFactory'
import { UUID } from '@/shared/provider/UUID/UUID'

import { Email } from './Email'
import { Password } from './Password'
import { Permission } from './Permission'
import { Role } from './Role'

type UserType = Omit<PickProps<User>, 'password'> & {
  password: string
}

export class User {
  id?: string
  email: string
  password: Password
  name?: string
  picture?: string
  isEmailVerified?: boolean = false
  isActive?: boolean = true
  createdAt?: Date = new Date()
  updatedAt?: Date = new Date()
  role?: Role[] = []
  permission?: Permission[] = []

  constructor(props: UserType, uuid: UUID = new ProviderFactory().createUUIDProvider()) {
    Object.assign(this, props)
    this.id = props.id ?? uuid.generate()
    this.email = new Email(props.email).getValue()
    this.password = new Password(props.password)
    this.name = props.name && this.capitalize(props.name)
  }

  private capitalize(text: string): string {
    return text
      .trim()
      .toLowerCase()
      .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()))
  }

  get firstName(): string {
    return this.name?.split(' ')[0] || undefined
  }

  get middleName(): string {
    return this.name?.split(' ').slice(1, -1).join(' ') || undefined
  }

  get lastName(): string {
    const splittedName = this.name?.split(' ')

    return splittedName?.length >= 2 ? splittedName.slice(-1)[0] : undefined
  }

  get nameInitials(): string {
    const [firstLetter, secondLetter] = [this.firstName?.charAt(0) || '', this.lastName?.charAt(0) || '']

    return (firstLetter + secondLetter).toUpperCase() || undefined
  }

  addRole(role: Role): void {
    if (!this.role.find((r) => r.id === role.id || r.label === role.label)) {
      this.role.push(role)
    }
  }

  removeRole(role: Role): void {
    this.role = this.role.filter((r) => r.id !== role.id && r.label !== role.label)
  }

  addPermission(permission: Permission): void {
    if (!this.permission.find((p) => p.id === permission.id || p.label === permission.label)) {
      this.permission.push(permission)
    }
  }

  removePermission(permission: Permission): void {
    this.permission = this.permission.filter((p) => p.id !== permission.id && p.label !== permission.label)
  }
}
