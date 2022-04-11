import { nanoid } from 'nanoid'

import { UUIDAdapter } from '@/application/adapter/UUIDAdapter'

export class NanoidAdapter implements UUIDAdapter {
  generate (length: number = 21): string {
    return nanoid(length)
  }
}
