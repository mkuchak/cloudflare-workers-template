import { faker } from '@faker-js/faker'

import { config } from '@/config'
import { ProviderFactory } from '@/shared/infra/factory/ProviderFactory'

const uuid = new ProviderFactory().createUUIDProvider()
const jwt = new ProviderFactory().createJWTProvider()

export const userFactory = () => ({
  email: faker.internet.email(),
  password: faker.internet.password(16, false, /\w/, '1@Aa'),
  name: faker.name.findName(),
  picture: faker.image.avatar(),
})

export const roleFactory = () => ({
  label: `newRoleLabel_${uuid.generate(8)}`,
  title: 'New Role',
  description: 'This is a new role',
})

export const permissionFactory = () => ({
  label: `newPermissionLabel_${uuid.generate(8)}`,
  title: 'New Permission',
  description: 'This is a new permission',
})

export const accessTokenFactory = async (roles?: string[], permissions?: string[]) => {
  return await jwt.sign(
    {
      id: uuid.generate(),
      roles,
      permissions,
      exp: Math.floor(Date.now() / 1000) + 60 * config.jwtExpiration,
    },
    config.jwtSecret,
  )
}
