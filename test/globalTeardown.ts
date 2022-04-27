import { down, exec } from 'docker-compose'
import isCI from 'is-ci'
import { join } from 'path'

export default async function () {
  if (isCI) {
    down()
  } else {
    await exec('dataproxy-test', ['sh', '-c', 'npm run prisma:reset'], {
      cwd: join(__dirname),
    })
  }
}
