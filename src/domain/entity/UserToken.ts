import UAParser from 'ua-parser-js'

import { NanoidAdapter } from '@/infra/adapter/uuid/NanoidAdapter'
import { UUID } from '@/infra/adapter/uuid/UUID'

type UserTokenType = Omit<PickProps<UserToken>, 'expiresAt'> & {
  expiresAt: Date | number;
};

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

  constructor (userToken: UserTokenType, uuid: UUID = new NanoidAdapter()) {
    Object.assign(this, userToken)
    this.id = userToken.id ?? uuid.generate()
    this.token = userToken.token ?? uuid.generate(128)
    this.expiresAt = userToken.expiresAt && this.formatToDate(userToken.expiresAt)
  }

  private formatToDate (expiresAt: Date | number): Date {
    if (typeof expiresAt === 'number') {
      return this.convertSecondsToFutureDate(expiresAt)
    }

    return new Date(expiresAt)
  }

  private convertSecondsToFutureDate (seconds: number): Date {
    return new Date(Date.now() + seconds * 1000)
  }

  userAgentParsed (userAgentParser: UAParser = new UAParser()) {
    return userAgentParser.setUA(this.userAgent).getResult()
  }

  get browser () {
    const { name, version } = this.userAgentParsed().browser

    return name && version ? `${name} ${version}` : undefined
  }

  get os () {
    const { name, version } = this.userAgentParsed().os

    return name && version ? `${name} ${version}` : undefined
  }

  get device () {
    const { vendor, model } = this.userAgentParsed().device

    return vendor && model ? `${vendor} ${model}` : 'PC'
  }

  get platform () {
    return this.userAgentParsed().device.type ?? 'desktop'
  }

  get location () {
    return `${this.city}, ${this.region}`
  }
}
