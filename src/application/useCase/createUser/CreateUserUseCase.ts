import { status } from 'itty-router-extras'

import { CryptoAdapter } from '@/application/adapter/CryptoAdapter'
import { User } from '@/domain/entity/User'
import { UserRepository } from '@/domain/repository/UserRepository'
import { BcryptjsAdapter } from '@/infra/adapter/BcryptjsAdapter'

import { CreateUserInputDTO } from './CreateUserInputDTO'
import { CreateUserOutputDTO } from './CreateUserOutputDTO'

export class CreateUserUseCase {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly cryptoAdapter: CryptoAdapter = new BcryptjsAdapter(),
  ) {}

  async execute (
    input: CreateUserInputDTO,
  ): Promise<Response | CreateUserOutputDTO> {
    const { email, password, name, picture } = input

    const emailAlreadyExists = !!(await this.userRepository.findByEmail(email))

    if (emailAlreadyExists) {
      return status(409, {
        message: 'User already exists',
      })
    }

    const hashedPassword = await this.cryptoAdapter.hash(password)

    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      picture,
    })

    await this.userRepository.save(user)

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    }
  }
}
