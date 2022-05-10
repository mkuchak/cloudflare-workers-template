import { nanoid } from 'nanoid'

export const permission = [
  {
    id: nanoid(),
    label: 'read_user',
  },
  {
    id: nanoid(),
    label: 'write_user',
  },
  {
    id: nanoid(),
    label: 'read_role',
  },
  {
    id: nanoid(),
    label: 'write_role',
  },
  {
    id: nanoid(),
    label: 'read_permission',
  },
  {
    id: nanoid(),
    label: 'write_permission',
  },
]
