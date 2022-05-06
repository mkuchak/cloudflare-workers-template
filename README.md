# Cloudflare Workers Template

Quickly go from MVP to scale with this template.

**Why this is amazing**? Start with a simple `hello world` Worker and see how quickly you can get up and running. Then, add more features and see how quickly you can scale. If your app grows, you can easily eject from Workers or split into multiple and reuse the entire codebase.

<div align="center">

<img src="https://img.shields.io/badge/TypeScript-3178c6.svg?logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Cloudflare-F6821F?logo=cloudflare&logoColor=white" />
<img src="https://img.shields.io/badge/Prisma-0C3249?logo=prisma" />
<img src="https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white" />
<img src="https://img.shields.io/badge/ESBuild-EDB30B?logo=esbuild&logoColor=white" />
<img src="https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white" />
<img src="https://img.shields.io/badge/Jest-C21325.svg?logo=jest&logoColor=white" />
<img src="https://img.shields.io/badge/Docker-2496ED.svg?logo=docker&logoColor=white" />
<img src="https://img.shields.io/badge/GitHub_Actions-%232671E5.svg?logo=githubactions&logoColor=white" />

</div>

## Quick start

Clone this repository without commit history:
```bash
git clone --depth 1 --branch main https://github.com/mkuchak/cloudflare-workers-template.git my-awesome-app
```

Rename the app name in `package.json` and `wrangler.toml`.

### Easy development mode start

Follow this order of commands to get started.

```bash
# Copy the example .env file and modify as needed
cp .env.example .env

# Start database and dataproxy server to develop locally (wait some seconds for container processes to rise)
docker-compose up -d

# Install dependencies
npm install

# Generate Prisma Client using dataproxy feature
npm run prisma:generate

# Start development mode in a local environment that emulates production resources (Durable Objects, KV, etc.)
npm run dev
```

**ATTENTION**: Make sure you have configured the `.env` file with your `DATABASE_URL` on [Prisma Data Platform](https://www.prisma.io/dataplatform) before running `npm run prisma:generate` command. Every time the database URL is changed this command must be executed.

The Prisma Schema path is `src/infra/repository/prisma/schema.prisma`. You can change it in `package.json` if you want to, but is needed to change the Docker containers too in `docker-compose*.yml`.

### Testing

When running the tests, an in-memory `MariaDB` database is instantiated with docker-compose so that the tests run quickly. Once instantiated, the database — along with the dataproxy — keeps running. This facilitates a new battery of tests.

```bash
# Start Jest tests
npm run test

# Start tests, watch for changes and re-run tests if any source files change
npm run test:watch

# Start tests and generate coverage report
npm run test:coverage

# Drop test containers
docker-compose -f docker-compose.test.yml down
```

**Do not start test containers** with the `docker-compose` command. These containers need to start from the `globalSetup.ts` file specified in the Jest settings.

### Useful commands

```bash
# Build the app using ESBuild
npm run build

# Authenticate with Cloudflare
npm run credentials

# Start development mode in local environment with globalAsyncIO, globalTimers and globalRandom enabled
npm run dev:globals

# Start development mode in a production-like environment on Cloudflare
npm run dev:staging

# Deploy app on Cloudflare in staging mode
npm run publish:staging

# Deploy app on Cloudflare in production mode
npm run publish

# Track the logs in production mode
npm run logs

# Create migrations from schema modifications
npm run prisma:create

# Apply migrations
npm run prisma:migrate

# Create and apply migrations
npm run prisma:migrate:dev

# Synchronize schema and database without changing migrations table (useful in PlanetScale)
npm run prisma:sync

# Synchronize remote database with local schema (Prisma Introspection)
npm run prisma:sync:reverse

# Reset entire development/test database
npm run prisma:reset
npm run prisma:reset:test

# Start only development containers (not test ones, it needs to start with test command)
npm run dataproxy:start

# Stop all containers (including the test ones)
npm run dataproxy:stop

# Stop all containers and start development containers
npm run dataproxy:restart

# Remove all containers and volumes (database data is lost) and up it again (excluding test containers)
npm run dataproxy:reset

# Detect and fix linting errors
npm run lint
npm run lint:fix
```

### Temporary Prisma issue

Be sure that after run `npm run install` the Prisma `@prisma+client+3.12.0.patch` is applied; if not, apply it manually with:
```bash
# Fix Prisma issue with Miniflare
npm run postinstall
```

To know more check [prisma/prisma#12356](https://github.com/prisma/prisma/issues/12356) issue.

## Schema and features

The default schema and API brings some useful things to start a project like user table, refresh token, authentication and authorization.

![ER Diagram](https://user-images.githubusercontent.com/3791148/167148444-f7fa0f61-4ac2-426d-b41c-06c0ccbee334.svg)

## To-do

- ~~Dockerize the application~~
- ~~Start a clean architecture model~~
- ~~Create a test suite with Jest~~
- ~~Create http/request/response adapter~~
- ~~Use [Web Crypto API](https://developers.cloudflare.com/workers/runtime-apis/web-crypto/) to use less CPU-time~~
- ~~Add error handling with response~~
- Start a durable object model
- Add SendGrid mailer with provider to confirm email
- Implement authentication and authorization
- Start a CI/CD pipeline example with wrangler and GitHub Actions
- ...
- This is under construction yet

## License

This project is licensed with the [MIT License](LICENSE).
