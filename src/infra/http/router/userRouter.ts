import { CreateUserController } from '@/infra/controller/CreateUserController'

import { IttyRouterAdapter } from '../IttyRouterAdapter'

const createUserController = new CreateUserController()

export const userRouter = new IttyRouterAdapter('/users')

userRouter.on('post', '/', createUserController.handle)
