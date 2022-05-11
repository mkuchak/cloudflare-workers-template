import { nanoid } from 'nanoid'

export const permission = [
  {
    id: nanoid(),
    label: 'read:user',
  },
  {
    id: nanoid(),
    label: 'write:user',
  },
  {
    id: nanoid(),
    label: 'read:role',
  },
  {
    id: nanoid(),
    label: 'write:role',
  },
  {
    id: nanoid(),
    label: 'read:permission',
  },
  {
    id: nanoid(),
    label: 'write:permission',
  },
]
