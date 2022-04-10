import { StatusError, ThrowableRouter } from 'itty-router-extras'

import { userRoute } from './userRoute'

export const router = ThrowableRouter()

router.all('/users/*', userRoute.handle)

router.all('*', () => {
  throw new StatusError(404, 'Not Found')
})
