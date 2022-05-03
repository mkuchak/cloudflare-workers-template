import jwt from '@tsndr/cloudflare-worker-jwt'

import { AppError } from '@/infra/error/AppError'

interface UserACL {
  // access control list
  id: string;
  roles: string[];
  permissions: string[];
}

export const isUser = (roles: string[] = [], matchAll: boolean = false) => {
  return async (request: Request) => {
    const accessToken = request.headers.get('Authorization')?.split(' ')[1]

    const isValidToken =
      accessToken && (await jwt.verify(accessToken, 'secret'))

    if (!isValidToken) {
      throw new AppError('Not Authorized', 401)
    }

    const {
      id: userId,
      roles: userRoles,
      permissions: userPermissions,
    } = jwt.decode(accessToken) as UserACL

    if (
      roles.length > 0 &&
      ((matchAll && !roles.every((role) => userRoles.includes(role))) ||
        !roles.some((role) => userRoles.includes(role)))
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
