import { RepositoryFactoryPrisma } from './infra/factory/RepositoryFactoryPrisma'
import { Router } from './infra/http/router/Router'
import { WorktopHttp } from './infra/http/workers/WorktopHttp'
// import { IttyRouterHttp } from './infra/http/workers/IttyRouterHttp'
// import { ExpressFlareHttp } from './infra/http/workers/ExpressFlareHttp'

const router = new Router(
  new WorktopHttp(), // worktop@next may be not ready-to-use in production yet
  // new IttyRouterHttp(),
  // new ExpressFlareHttp(),
  // new ExpressHttp(), // TODO: only works on Node.js (npm run dev:node)
  new RepositoryFactoryPrisma(),
)

router.init('/api/v1')

export default {
  async fetch<Environment = unknown, Context = unknown> (
    request: Request,
    env: Environment,
    context: Context,
  ) {
    return router.http.listen(request, env, context)
  },
}
