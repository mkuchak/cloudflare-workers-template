import { NanoidAdapter } from '@/infra/adapter/uuid/NanoidAdapter'
import { UUID } from '@/infra/adapter/uuid/UUID'
import { AppError } from '@/infra/error/AppError'

export class UserToken {
  id?: string;
  userId: string;
  token?: string;
  code?: string;
  codeAttempts?: number;
  userAgent?: string;
  lastIp?: string;
  asn?: number;
  asOrganization?: string;
  timezone?: string;
  continent?: string;
  country?: string;
  region?: string;
  regionCode?: string;
  city?: string;
  postalCode?: string;
  longitude?: string;
  latitude?: string;
  isEmailToken?: boolean = false;
  expiresAt?: Date;
  createdAt?: Date = new Date();
  updatedAt?: Date = new Date();

  constructor (
    userToken: PickProps<UserToken>,
    uuid: UUID = new NanoidAdapter(),
  ) {
    if (this.isExpired(userToken.expiresAt)) {
      throw new AppError('Invalid Token', 401)
    }

    Object.assign(this, userToken)
    this.id = userToken.id ?? uuid.generate()
    this.token = userToken.token ?? uuid.generate(128)
  }

  private isExpired (expiresAt?: Date): boolean {
    return expiresAt && expiresAt < new Date()
  }
}
