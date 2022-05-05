import jwt from '@tsndr/cloudflare-worker-jwt'

import { JWT } from './JWT'

export class CfwJWTAdapter implements JWT {
  async sign(payload: any, secret: string, options?: any): Promise<string> {
    return await jwt.sign(payload, secret, options)
  }

  async verify(token: string, secret: string, options?: any): Promise<boolean> {
    return await jwt.verify(token, secret, options)
  }

  decode(token: string): any {
    return jwt.decode(token)
  }
}
