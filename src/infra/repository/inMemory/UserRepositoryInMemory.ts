import { User } from '@/domain/entity/User'
import { UserRepository } from '@/domain/repository/UserRepository'

export class UserRepositoryInMemory implements UserRepository {
  private static instance: UserRepositoryInMemory

  constructor(private user: User[] = []) {
    if (!UserRepositoryInMemory.instance) {
      UserRepositoryInMemory.instance = this
    }

    return UserRepositoryInMemory.instance
  }

  async save(user: User): Promise<void> {
    this.user.push(user)
  }

  async findById(id: string): Promise<User> {
    return this.user.find((user) => user.id === id)
  }

  async findByEmail(email: string): Promise<User> {
    return this.user.find((user) => user.email === email)
  }
}
