import { StatusError, ThrowableRouter } from 'itty-router-extras'

import { userRouter } from './userRouter'

export const router = ThrowableRouter()

router.all('/users/*', userRouter.handle)

router.all('*', () => {
  throw new StatusError(404, 'Not Found')
})
