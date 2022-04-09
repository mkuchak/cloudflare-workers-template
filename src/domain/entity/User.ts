import { NanoidAdapter } from '@/infra/adapter/NanoidAdapter'

export class User {
  id?: string = new NanoidAdapter().generate();
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
