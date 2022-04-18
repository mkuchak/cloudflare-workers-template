import { compose, Router } from 'worktop'
import { start } from 'worktop/cfw'
import { parse } from 'worktop/cookie'
import * as CORS from 'worktop/cors'
import { reply } from 'worktop/response'
import { body } from 'worktop/utils'

import { Http } from './Http'

export class WorktopHttp implements Http {
  private readonly router: any;

  constructor () {
    this.router = new Router()
    this.listen = this.router.run.bind(this.router)

    this.router.prepare = compose(
      CORS.preflight({
        origin: '*',
        headers: ['Cache-Control', 'Content-Type', 'X-Count'],
        methods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE'],
      }),
      async (request: any, context: any) => {
        request.content = undefined
        request.cookies = {}
        request.params = context.params
        request.query = Object.fromEntries(new URL(request.url).searchParams)

        try {
          request.content = await body(request)
        } catch {}

        try {
          request.cookies = parse(request.headers.get('cookie'))
        } catch {}
      },
    )

    this.router.onerror = (request: any, response: any) => {
      const statusCode = response.error.status || 500
      const message = response.error.message || 'Internal Server Error'
      delete response.error

      if (statusCode === 500 && message.includes("reading 'status'")) {
        return reply(404, { status: 404, error: 'Not Found' })
      }

      return reply(statusCode, {
        status: statusCode,
        error: message,
      })
    }

    // add rate limiting/firewall
    // add observability/logging
  }

  async join (...handlers: any): Promise<void> {
    if (typeof handlers[0] === 'string') {
      const [path, ...restHandlers] = handlers
      this.router.mount(path, ...restHandlers)
    } else {
      this.router.prepare = compose(...handlers)
    }
  }

  async on (method: string, path: string, ...handlers: any): Promise<void> {
    this.router.add(method.toUpperCase(), path, ...handlers)
  }

  async listen (): Promise<any> {
    return start(this.listen)
  }
}
