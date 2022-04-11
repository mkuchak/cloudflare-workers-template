import { WebCryptoUUIDAdapter } from '@/infra/adapter/uuid/WebCryptoUUIDAdapter'

export class User {
  id?: string = new WebCryptoUUIDAdapter().generate();
  email: string;
  password: string;
  name?: string;
  picture?: string;
  emailVerified?: boolean = false;
  createdAt?: Date = new Date();
  updatedAt?: Date = new Date();

  constructor (user: User) {
    Object.assign(this, user)
  }
}
