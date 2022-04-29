import { CreateUserUseCase } from '@/application/useCase/createUser/CreateUserUseCase'
import { NanoidAdapter } from '@/infra/adapter/uuid/NanoidAdapter'
import { RepositoryFactoryPrisma } from '@/infra/factory/RepositoryFactoryPrisma'

let repositoryFactory: RepositoryFactoryPrisma
let createUserUseCase: CreateUserUseCase
let uuid: NanoidAdapter

beforeAll(async () => {
  repositoryFactory = new RepositoryFactoryPrisma()
  createUserUseCase = new CreateUserUseCase(repositoryFactory)
  uuid = new NanoidAdapter()
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
