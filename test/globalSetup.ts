import detect from 'detect-port'
import { exec, upAll } from 'docker-compose'
import { join } from 'path'

const DB_PORT = 9307
const CWD_PATH = { cwd: join(__dirname) }

export default async function () {
  console.time('global-setup')

  const isDBReachable = (await detect(DB_PORT)) !== DB_PORT

  if (!isDBReachable) {
    await upAll({
      cwd: join(__dirname, '..'),
      config: 'docker-compose.test.yml',
      log: true,
    })

    await exec(
      'database-test',
      ['sh', '-c', 'while ! mysqladmin ping -h 127.0.0.1 --silent; do sleep 1; done'],
      CWD_PATH,
    )

    await exec('dataproxy-test', ['sh', '-c', 'npm run prisma:generate'], CWD_PATH)
    await exec('dataproxy-test', ['sh', '-c', 'npm run prisma:migrate'], CWD_PATH)
    await exec('dataproxy-test', ['sh', '-c', 'npm run prisma:studio &'], CWD_PATH)

    // Seed only metadata if it exists (do not seed test records)
    await exec('dataproxy-test', ['sh', '-c', 'npm run prisma:seed'], CWD_PATH)

    // Start dataproxy server and wait for it before starting tests
    await exec('dataproxy-test', ['sh', '-c', 'npm run start &'], CWD_PATH)
    await exec('dataproxy-test', ['sh', '-c', 'while ! netstat -tulpn | grep 9000; do sleep 1; done'], CWD_PATH)
  }

  console.timeEnd('global-setup')
}
