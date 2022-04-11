import { IttyRouterAdapter } from '../IttyRouterAdapter'
import { ResponseError } from '../response/ResponseError'
import { userRouter } from './userRouter'

export const router = new IttyRouterAdapter()

router.join('/users/*', userRouter.listen)

router.join('*', () => {
  throw new ResponseError(404, 'Not Found')
})
