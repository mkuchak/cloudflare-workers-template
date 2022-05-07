import { DAOFactoryPrisma } from './shared/infra/factory/DAOFactoryPrisma'
import { RepositoryFactoryPrisma } from './shared/infra/factory/RepositoryFactoryPrisma'
import { Router } from './shared/infra/http/router/Router'
import { WorktopHttp } from './shared/infra/http/workers/WorktopHttp'
// import { IttyRouterHttp } from './shared/infra/http/workers/IttyRouterHttp'
// import { ExpressFlareHttp } from './shared/infra/http/workers/ExpressFlareHttp'

const router = new Router(
  new WorktopHttp(),
  // new IttyRouterHttp(),
  // new ExpressFlareHttp(),
  new RepositoryFactoryPrisma(),
  new DAOFactoryPrisma(),
)

router.init('/api/v1')

export default {
  async fetch<Environment = unknown, Context = unknown>(request: Request, env: Environment, context: Context) {
    return router.http.listen(request, env, context)
  },
}
