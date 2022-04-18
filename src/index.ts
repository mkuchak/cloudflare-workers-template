// The router below can be used as an alternative to split into multiple route files
// Just import this router, delete the next lines and keep the "export default"
// import { router } from './infra/http/router/index'

import { RepositoryFactoryPrisma } from './infra/factory/RepositoryFactoryPrisma'
import { Router } from './infra/http/Router'
import { WorktopHttp } from './infra/http/WorktopHttp'
// import { IttyRouterHttp } from './infra/http/IttyRouterHttp'

const router = new Router(
  new WorktopHttp(), // new IttyRouterHttp(),
  new RepositoryFactoryPrisma(),
)

router.init()

export default {
  fetch: router.http.listen,
}
