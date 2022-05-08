import { config } from '@/config'
import { AppError } from '@/shared/error/AppError'
import { JWT } from '@/shared/provider/JWT/JWT'

import { ProviderFactory } from '../../factory/ProviderFactory'

// User Access Control List
interface UserACL {
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
      throw new AppError('Invalid Token', 401)
    }

    const { id: userId, permissions: userRoles, permissions: userPermissions } = jwt.decode(accessToken) as UserACL

    const hasPermission =
      !permissions.length || matchAll
        ? permissions.every((permission) => userPermissions.includes(permission))
        : permissions.some((permission) => userPermissions.includes(permission))

    if (!hasPermission) {
      throw new AppError('Restricted Access', 403)
    }

    request.user = {
      id: userId,
      roles: userRoles,
      permissions: userPermissions,
    }
  }
}
