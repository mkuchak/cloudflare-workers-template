import { CreateUserUseCase } from '@/application/useCase/createUser/CreateUserUseCase'
import { WebCryptoHashAdapter } from '@/infra/adapter/hash/WebCryptoHashAdapter'
import { WebCryptoUUIDAdapter } from '@/infra/adapter/uuid/WebCryptoUUIDAdapter'
import { RepositoryFactoryInMemory } from '@/infra/factory/RepositoryFactoryInMemory'

let uuid: WebCryptoUUIDAdapter
let hash: WebCryptoHashAdapter
let repositoryFactory: RepositoryFactoryInMemory
let createUserUseCase: CreateUserUseCase

beforeAll(async () => {
  uuid = new WebCryptoUUIDAdapter()
  hash = new WebCryptoHashAdapter()
  repositoryFactory = new RepositoryFactoryInMemory()
  createUserUseCase = new CreateUserUseCase(repositoryFactory, hash, uuid)
})

describe('CreateUserUseCase', () => {
  it('should create a new user with a valid email and password', async () => {
    const input = {
      email: `john_doe_${uuid.generate().toLowerCase()}@gmail.com`,
      password: '12345@Aa',
    }
    await createUserUseCase.execute(input)

    const userRepository = repositoryFactory.createUserRepository()
    const user = await userRepository.findByEmail(input.email)

    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: input.email,
      }),
    )
  })

  it('should throw an error if the email is already taken', async () => {
    const input = {
      email: `john_doe_${uuid.generate().toLowerCase()}@gmail.com`,
      password: '12345@Aa',
    }
    await createUserUseCase.execute(input)

    await expect(createUserUseCase.execute(input)).rejects.toThrowError(
      'User Already Exists',
    )
  })
})
