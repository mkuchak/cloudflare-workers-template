import { CreateUserUseCase } from '@/application/useCase/createUser/CreateUserUseCase'
import { ProviderFactory } from '@/shared/infra/factory/ProviderFactory'
import { RepositoryFactoryInMemory } from '@/shared/infra/factory/RepositoryFactoryInMemory'

const uuid = new ProviderFactory().createUUIDProvider()

let repositoryFactory: RepositoryFactoryInMemory
let createUserUseCase: CreateUserUseCase

beforeAll(async () => {
  repositoryFactory = new RepositoryFactoryInMemory()
  createUserUseCase = new CreateUserUseCase(repositoryFactory)
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

    await expect(createUserUseCase.execute(input)).rejects.toThrowError('User Already Exists')
  })
})
