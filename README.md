# Cloudflare Workers Template

Quickly go from MVP to scale with this template.

**Why this is awesome**? Start with a simple hello world worker and see how quickly you can get up and running. Then, add more features and see how quickly you can scale. If your app grows, you can easily eject from Workers and reuse the entire codebase.

## Quick start

Development mode:
```bash
# Copy the example .env file and modify as needed
cp .env.example .env

# Install dependencies
npm install

# Generate Prisma Client with types for DataProxy
npm run prisma:generate

# Start development mode
npm run dev
```

Make sure you have configured the `.env` file with your `DATABASE_URL` on [Prisma Data Platform](https://www.prisma.io/dataplatform) before running `npm run prisma:generate` command.

Useful commands:
```bash
# Build the app using ESBuild
npm run build

# Authenticate with Cloudflare
npm run credentials

# Deploy app in staging mode
npm run dev:staging

# Deploy app in production mode
npm run publish

# Create migrations
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

Be sure that after run `npm run install` the Prisma `@prisma+client+3.12.0.patch` is applied; if not, apply it with:
```bash
# Fix Prisma issue with Miniflare
npm postinstall
```

To know more check [prisma/prisma#12356 ](https://github.com/prisma/prisma/issues/12356) issue.


## To-do

- Dockerize the application
- Start a clean architecture model
- Start a durable object model
- Create a test suite with Jest
- This is under construction yet
