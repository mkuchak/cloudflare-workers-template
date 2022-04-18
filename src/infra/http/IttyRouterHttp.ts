import {
  ThrowableRouter,
  withContent,
  withCookies,
  withParams,
} from 'itty-router-extras'

import { Http } from './Http'

export class IttyRouterHttp implements Http {
  private readonly router: ThrowableRouter;

  constructor (path?: string) {
    this.router = ThrowableRouter({ base: path })
    this.listen = this.router.handle.bind(this.router)
    // add cors support
    // add rate limiting/firewall
    // add observability/logging
  }

  async join (path: string, ...handlers: any): Promise<void> {
    this.router.all(path, ...handlers)
  }

  async on (method: string, path: string, ...handlers: any): Promise<void> {
    this.router[method](
      path,
      withContent,
      withCookies,
      withParams,
      ...handlers,
    )
  }

  async listen (request: any, ...extra: any): Promise<any> {
    return this.listen(request, ...extra)
  }
}
