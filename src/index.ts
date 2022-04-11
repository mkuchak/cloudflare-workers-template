import { router } from './infra/http/router'

export default {
  fetch: router.handle,
}
