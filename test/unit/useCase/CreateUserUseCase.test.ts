import { CreateUserUseCase } from '@/application/useCase/createUser/CreateUserUseCase'
import { User } from '@/domain/entity/User'
import { RepositoryFactoryPrisma } from '@/infra/factory/RepositoryFactoryPrisma'

const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

describe('create user use case', () => {
  it('should create user', async () => {
    const repositoryFactory = new RepositoryFactoryPrisma()
    const createUserUseCase = new CreateUserUseCase(repositoryFactory)

    const email = `john_doe_${random(1000000, 9999999)}@gmail.com`

    const newUser = new User({
      email,
      password: '12345@Aa',
      name: 'John Doe',
    })

    await createUserUseCase.execute(newUser)

    const userRepository = repositoryFactory.createUserRepository()
    const user = await userRepository.findByEmail(email)

    console.log(user)

    expect(user).toBeDefined()
  })
})
