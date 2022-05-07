import { nanoid } from 'nanoid'

import { UUID } from '../UUID'

export class NanoidProvider implements UUID {
  generate(length: number = 21): string {
    return nanoid(length)
  }
}
