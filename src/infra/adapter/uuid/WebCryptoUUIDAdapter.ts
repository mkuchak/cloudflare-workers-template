import { UUID } from './UUID'

export class WebCryptoUUIDAdapter implements UUID {
  generate(): string {
    return crypto.randomUUID()
  }
}
