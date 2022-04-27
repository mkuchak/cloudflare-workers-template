import { CreateUserUseCase } from '@/application/useCase/createUser/CreateUserUseCase'
import { User } from '@/domain/entity/User'
import { RepositoryFactoryPrisma } from '@/infra/factory/RepositoryFactoryPrisma'

describe('create user use case', () => {
  it('should create user', async () => {
    const repositoryFactory = new RepositoryFactoryPrisma()
    const createUserUseCase = new CreateUserUseCase(repositoryFactory)

    const newUser = new User({
      email: 'johndoe44@gmail.com',
      password: '12345@Aa',
      name: 'John Doe',
    })

    await createUserUseCase.execute(newUser)

    const userRepository = repositoryFactory.createUserRepository()
    const user = await userRepository.findByEmail('johndoe44@gmail.com')

    console.log(user)

    expect(user).toBeDefined()
  })
})
