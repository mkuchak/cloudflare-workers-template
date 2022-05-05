import { json, ThrowableRouter, withContent, withCookies, withParams } from 'itty-router-extras'

import { Http } from '../Http'

export class IttyRouterHttp implements Http {
  private readonly router: ThrowableRouter
  private readonly globalMiddlewares: any[] = []

  constructor(path?: string) {
    this.router = ThrowableRouter({ base: path })
    this.listen = this.router.handle.bind(this.router)
    // TODO: add cors support
    // TODO: add rate limiting/firewall
    // TODO: add observability/logging
  }

  async join(...handlers: any[]): Promise<void> {
    if (typeof handlers[0] === 'string') {
      const path = handlers.shift()

      this.router.all(path, ...handlers)
    } else {
      this.globalMiddlewares.push(...handlers)
    }
  }

  async on(method: string, path: string, ...handlers: any[]): Promise<void> {
    const callback = handlers.pop()

    this.router[method](
      path,
      withContent,
      withCookies,
      withParams,
      ...this.globalMiddlewares,
      ...handlers,
      async (request: any, response: any) => {
        const { status, payload } = await callback(request, response)

        return json(payload, { status })
      },
    )
  }

  async listen(request: any, ...extra: any): Promise<any> {
    return this.listen(request, ...extra)
  }
}
