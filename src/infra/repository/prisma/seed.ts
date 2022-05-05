import { PrismaClient } from '@prisma/client'

import { permission } from './seeds/permission'
import { permissionRole } from './seeds/permissionRole'
import { role } from './seeds/role'

const prisma = new PrismaClient()

async function seed() {
  await prisma.permission.createMany({
    data: permission,
  })

  await prisma.role.create({
    data: role,
  })

  await prisma.permissionRole.createMany({
    data: permissionRole,
  })
}

seed()
  .then(() => console.info('✅ Seeding success'))
  .catch((error) => console.error('❌ Seeding error', error))
