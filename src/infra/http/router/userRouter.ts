import { CreateUserController } from '@/infra/controller/CreateUserController'
import { RepositoryFactoryPrisma } from '@/infra/factory/RepositoryFactoryPrisma'

import { IttyRouterHttp } from '../IttyRouterHttp'

const repositoryFactoryPrisma = new RepositoryFactoryPrisma()

const createUserController = new CreateUserController(repositoryFactoryPrisma)

export const userRouter = new IttyRouterHttp('/users')

userRouter.on('post', '/', createUserController.handle)
