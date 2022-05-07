import { UUID } from '../UUID'

export class WebCryptoUUIDProvider implements UUID {
  generate(): string {
    return crypto.randomUUID()
  }
}
