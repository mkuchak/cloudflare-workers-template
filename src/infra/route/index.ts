import { Router } from 'itty-router'

import { userRoute } from './userRoute'

export const router = Router()

router.all('/', userRoute.handle)
