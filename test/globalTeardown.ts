import { down, exec } from 'docker-compose'
import isCI from 'is-ci'
import { join } from 'path'

export default async function () {
  if (isCI) {
    down()
  } else {
    // Clean the database occasionally
    if (Math.ceil(Math.random() * 10) === 10) {
      await exec('dataproxy-test', ['sh', '-c', 'npm run prisma:reset'], {
        cwd: join(__dirname),
      })
      // await exec('dataproxy-test', ['sh', '-c', 'npm run prisma:seed'], CWD_PATH)
    }
  }
}
