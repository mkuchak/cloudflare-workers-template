import jwt from '@tsndr/cloudflare-worker-jwt'

import { AppError } from '@/infra/error/AppError'

// User Access Control List
interface UserACL {
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

    const hasRole =
      !roles.length || matchAll
        ? roles.every((role) => userRoles.includes(role))
        : roles.some((role) => userRoles.includes(role))

    if (!hasRole) {
      throw new AppError('Restricted Access', 403)
    }

    request.user = {
      id: userId,
      roles: userRoles,
      permissions: userPermissions,
    }
  }
}
