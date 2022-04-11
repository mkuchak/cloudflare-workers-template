import { UUIDAdapter } from '@/application/adapter/UUIDAdapter'

export class WebCryptoUUIDAdapter implements UUIDAdapter {
  generate (): string {
    return crypto.randomUUID()
  }
}
