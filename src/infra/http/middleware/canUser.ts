import jwt from '@tsndr/cloudflare-worker-jwt'

import { AppError } from '@/infra/error/AppError'

interface UserACL { // access control list
  id: string;
  roles: string[];
  permissions: string[];
}

export const canUser = (permissions: string[] = [], matchAll: boolean = false) => {
  return async (request: Request) => {
    const accessToken = request.headers.get('Authorization')?.split(' ')[1]

    const isValidToken =
      accessToken && (await jwt.verify(accessToken, 'secret'))

    if (!isValidToken) {
      throw new AppError('Invalid Token', 401)
    }

    const {
      id: userId,
      permissions: userRoles,
      permissions: userPermissions,
    } = jwt.decode(accessToken) as UserACL

    if (
      permissions.length > 0 &&
      ((matchAll && !permissions.every((permission) => userPermissions.includes(permission))) ||
        !permissions.some((permission) => userPermissions.includes(permission)))
    ) {
      throw new AppError('Restricted Access', 403)
    }

    request.user = {
      id: userId,
      roles: userRoles,
      permissions: userPermissions,
    }
  }
}
