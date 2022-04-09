# Cloudflare Workers Template

Quickly go from MVP to scale with this template.

**Why this is amazing**? Start with a simple `hello world` Worker and see how quickly you can get up and running. Then, add more features and see how quickly you can scale. If your app grows, you can easily eject from Workers or split into multiple and reuse the entire codebase.

## Quick start

Clone this repository without commit history:
```bash
git clone --depth 1 --branch main https://github.com/mkuchak/cloudflare-workers-template.git my-awesome-app
```

Rename the app name in `package.json` and `wrangler.toml`.

### Development mode:

```bash
# Copy the example .env file and modify as needed
cp .env.example .env

# Install dependencies
npm install

# Generate Prisma Client with types using DataProxy
npm run prisma:generate

# Start development mode
npm run dev
```

**ATTENTION**: Make sure you have configured the `.env` file with your `DATABASE_URL` on [Prisma Data Platform](https://www.prisma.io/dataplatform) before running `npm run prisma:generate` command. Every time the database URL is changed this command must be executed.

The Prisma Schema path is `src/infra/repository/prisma/schema.prisma`. You can change it in `package.json` if you want to.

### Useful commands:

```bash
# Build the app using ESBuild
npm run build

# Authenticate with Cloudflare
npm run credentials

# Start development mode without globalAsyncIO, globalTimers and globalRandom
npm run dev:globals

# Start app to develop in staging mode
npm run dev:staging

# Deploy app in production mode
npm run publish

# Track the logs in production mode
npm run logs

# Create migrations from schema modifications
npm run prisma:create

# Apply migrations
npm run prisma:migrate

# Create and apply migrations
npm run prisma:migrate:dev

# Reset entire database
npm run prisma:reset

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

![ER Diagram](src/infra/repository/prisma/ERD.svg)

## To-do

- Dockerize the application
- Start a clean architecture model
- Start a durable object model
- Create a test suite with Jest
- Create http/request/response adapter
- Use [Web Crypto API](https://developers.cloudflare.com/workers/runtime-apis/web-crypto/) to use less CPU-time
- Add SendGrid mailer with provider to confirm email
- Implement authentication and authorization
- Add error handling with response
- Start a CI/CD pipeline example with wrangler and GitHub Actions
- ...
- This is under construction yet
