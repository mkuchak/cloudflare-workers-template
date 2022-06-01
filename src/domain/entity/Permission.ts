import { ProviderFactory } from '@/shared/infra/factory/ProviderFactory'
import { UUID } from '@/shared/provider/UUID/UUID'

type PermissionProps = PickProps<Permission>

export class Permission {
  id?: string
  label: string
  title?: string
  description?: string
  createdAt?: Date = new Date()
  updatedAt?: Date = new Date()

  constructor(props: PermissionProps, uuid: UUID = new ProviderFactory().createUUIDProvider()) {
    Object.assign(this, props)
    this.id = props.id ?? uuid.generate()
  }
}
