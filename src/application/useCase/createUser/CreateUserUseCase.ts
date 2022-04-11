import { StatusError } from 'itty-router-extras'

import { User } from '@/domain/entity/User'
import { UserRepository } from '@/domain/repository/UserRepository'
import { BcryptjsAdapter } from '@/infra/adapter/crypto/BcryptjsAdapter'
import { Crypto } from '@/infra/adapter/crypto/Crypto'

import { CreateUserInputDTO } from './CreateUserInputDTO'
import { CreateUserOutputDTO } from './CreateUserOutputDTO'

export class CreateUserUseCase {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly cryptoAdapter: Crypto = new BcryptjsAdapter(),
  ) {}

  async execute (
    input: CreateUserInputDTO,
  ): Promise<Response | CreateUserOutputDTO> {
    const { email, password, name, picture } = input

    const emailAlreadyExists = !!(await this.userRepository.findByEmail(email))

    if (emailAlreadyExists) {
      throw new StatusError(409, 'User Already Exists')
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
