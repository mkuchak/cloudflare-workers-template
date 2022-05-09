import { ProviderFactory } from '@/shared/infra/factory/ProviderFactory'
import { UUID } from '@/shared/provider/UUID/UUID'

export class Permission {
  id?: string
  label: string
  title?: string
  description?: string
  createdAt?: Date = new Date()
  updatedAt?: Date = new Date()

  constructor(props: PickProps<Permission>, uuid: UUID = new ProviderFactory().createUUIDProvider()) {
    Object.assign(this, props)
    this.id = props.id ?? uuid.generate()
  }
}
