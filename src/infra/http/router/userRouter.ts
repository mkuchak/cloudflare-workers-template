import { Router } from 'itty-router'
import { withContent, withCookies, withParams } from 'itty-router-extras'

import { CreateUserController } from '@/infra/controller/CreateUserController'

const createUserController = new CreateUserController()

export const userRouter = Router({ base: '/users' })

userRouter.post(
  '/',
  withContent,
  withCookies,
  withParams,
  createUserController.handle,
)
