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
    label: 'read_roles',
  },
  {
    id: nanoid(),
    label: 'write_roles',
  },
  {
    id: nanoid(),
    label: 'read_permissions',
  },
  {
    id: nanoid(),
    label: 'write_permissions',
  },
]
