import { nanoid } from 'nanoid'

import { UniqueIdAdapter } from '@/application/adapter/UniqueIdAdapter'

export class NanoidAdapter implements UniqueIdAdapter {
  generate (length: number = 21): string {
    return nanoid(length)
  }
}
