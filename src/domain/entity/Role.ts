import { ProviderFactory } from '@/shared/infra/factory/ProviderFactory'
import { UUID } from '@/shared/provider/UUID/UUID'

import { Permission } from './Permission'

export class Role {
  id?: string
  label: string
  title?: string
  description?: string
  permission?: Permission[]
  createdAt?: Date = new Date()
  updatedAt?: Date = new Date()

  constructor(props: PickProps<Role>, uuid: UUID = new ProviderFactory().createUUIDProvider()) {
    Object.assign(this, props)
    this.id = props.id ?? uuid.generate()
    if (this.permission) {
      this.permission = this.permission.map((permission) => new Permission(permission))
    }
  }
}
