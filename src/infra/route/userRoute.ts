import { Router } from 'itty-router'
import { withContent, withCookies } from 'itty-router-extras'

import { CreateUserController } from '@/infra/controller/CreateUserController'

const createUserController = new CreateUserController()

export const userRoute = Router()

userRoute.post('/', withContent, withCookies, createUserController.handle)
