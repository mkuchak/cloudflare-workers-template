import { compose, Context, Router } from 'worktop'
import { start } from 'worktop/cfw'
import { parse } from 'worktop/cookie'
import { preflight } from 'worktop/cors'
import { reply } from 'worktop/response'
import { body } from 'worktop/utils'

import { Http } from '../Http'

const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']

export class WorktopHttp implements Http {
  private readonly router: any;
  private readonly globalMiddlewares: any[] = [];

  constructor () {
    this.router = new Router()

    this.router.prepare = compose(
      preflight({
        origin: '*',
        headers: ['Cache-Control', 'Content-Type', 'X-Count'],
        methods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE'],
      }),
    )

    this.router.onerror = (_request: any, response: any) => {
      const statusCode = response.error.status || 500
      const message = response.error.message || 'Internal Server Error'
      delete response.error

      return reply(statusCode, {
        status: statusCode,
        error: message,
      })
    }

    this.listen = this.router.run.bind(this.router)

    // TODO: add rate limiting/firewall
    // TODO: add observability/logging
  }

  async embedsRouteHandlers (request: Request, context: Context) {
    try { request.content = await body(request) } catch { request.content = undefined }
    try { request.cookies = parse(request.headers.get('cookie')) } catch { request.cookies = {} }
    request.params = context.params
    request.query = Object.fromEntries(new URL(request.url).searchParams)
  }

  async join (...handlers: any): Promise<void> {
    if (typeof handlers[0] === 'string') {
      const [path, handlerOrRouter] = handlers

      if (path.includes('*')) {
        return METHODS.forEach((method) =>
          this.router.add(method, path, handlerOrRouter),
        )
      }
      console.log('fez o mount')
      return this.router.mount(path, handlerOrRouter)
    }

    this.globalMiddlewares.push(...handlers)
  }

  async on (method: string, path: string, ...handlers: any): Promise<void> {
    const callback = handlers.pop()

    this.router.add(
      method.toUpperCase(),
      path,
      compose(
        this.embedsRouteHandlers,
        // TODO: globalMiddlewares could store path and middleware entries
        // so this could be a function that returns equivalent handlers of this route path
        // this way will be possible to add middlewares to specific group of paths
        ...this.globalMiddlewares,
        ...handlers,
        async (request: any, response: any) => {
          const { status, payload } = await callback(request, response)

          return reply(status, payload)
        },
      ),
    )
  }

  async listen (): Promise<any> {
    return start(this.listen)
  }
}
