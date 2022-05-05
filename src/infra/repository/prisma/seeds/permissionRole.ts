import { nanoid } from 'nanoid'

import { permission } from './permission'
import { role } from './role'

export const permissionRole = [
  {
    id: nanoid(),
    permissionId: permission[0].id,
    roleId: role.id,
  },
  {
    id: nanoid(),
    permissionId: permission[1].id,
    roleId: role.id,
  },
  {
    id: nanoid(),
    permissionId: permission[2].id,
    roleId: role.id,
  },
  {
    id: nanoid(),
    permissionId: permission[4].id,
    roleId: role.id,
  },
]
