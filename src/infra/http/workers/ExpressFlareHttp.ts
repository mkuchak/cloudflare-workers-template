import { handleRequest, NextType, RequestType, ResponseMethodType, router } from 'express-flare'

import { Http } from '../Http'

export class ExpressFlareHttp implements Http {
  private readonly router: any

  constructor() {
    this.router = router
    this.router.use(async (request: Request, _response: any, next: NextType) => {
      request.content = request.bodyContent
      next()
    })
    // TODO: add cors support
    // TODO: add rate limiting/firewall
    // TODO: add observability/logging
  }

  async join(...handlers: any[]) {
    if (typeof handlers[0] === 'string') {
      const path = handlers.shift()

      this.router.all(path, ...handlers)
    } else {
      handlers.forEach((handler: any) => this.router.use(handler))
    }
  }

  async on(method: any, path: string, ...handlers: any[]) {
    const callback = handlers.pop()

    this.router[method.toLowerCase()](
      path,
      async (request: RequestType, response: ResponseMethodType, next: any) => {
        for (const handler of handlers) {
          const handlerResponse = await handler(request, response)

          if (handlerResponse instanceof Object) {
            const { status, payload } = handlerResponse

            return response.status(status || 200).json(payload)
          }
        }

        next()
      },
      async (request: RequestType, response: ResponseMethodType) => {
        const { status, payload } = await callback(request, response)

        response.status(status).json(payload)
      },
    )
  }

  async listen(request: RequestType, env?: any, context?: any) {
    try {
      return await handleRequest({
        request,
        env,
        context,
        router: this.router,
        event: undefined,
      })
    } catch (error: any) {
      return new Response(JSON.stringify(error), {
        status: error.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }
}
