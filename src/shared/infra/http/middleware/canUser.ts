import { config } from '@/config'
import { HttpError } from '@/shared/error/HttpError'
import { JWT } from '@/shared/provider/JWT/JWT'

import { ProviderFactory } from '../../factory/ProviderFactory'

// User Role-based Access Control
interface UserRBAC {
  id: string
  roles: string[]
  permissions: string[]
}

export const canUser = (
  permissions: string[] = [],
  matchAll: boolean = false,
  jwt: JWT = new ProviderFactory().createJWTProvider(),
) => {
  return async (request: Request) => {
    const accessToken = request.headers.get('Authorization')?.split(' ')[1]

    const isValidToken = accessToken && (await jwt.verify(accessToken, config.jwtSecret))

    if (!isValidToken) {
      throw new HttpError('Invalid Token', 401)
    }

    const { id: userId, permissions: userRoles, permissions: userPermissions } = jwt.decode(accessToken) as UserRBAC

    const hasPermission =
      !permissions.length || matchAll
        ? permissions.every((permission) => userPermissions?.includes(permission))
        : permissions.some((permission) => userPermissions?.includes(permission))

    if (!hasPermission) {
      throw new HttpError('Restricted Access', 403)
    }

    request.user = {
      id: userId,
      roles: userRoles,
      permissions: userPermissions,
    }
  }
}
