# Crusaders Web

Crusaders Web is a NestJS/PostgreSQL API with a React/Vite storefront. The API
uses the `/api/v1` prefix; uploaded product images are served from `/uploads`.

## Requirements

- Node.js 22.12 or newer
- npm 10 or newer
- PostgreSQL

## Local setup

```bash
copy .env.example .env
npm ci
npm --prefix frontend ci
npm run migration:run
npm run dev
```

Run `npm --prefix frontend run dev` in another terminal. Vite proxies `/api` and
`/uploads` to the API during development.

No users or catalog data are silently created on application startup. To create
the first administrator, set the `SEED_SUPER_ADMIN_*` variables and run:

```bash
npm run seed:admin
```

The command is idempotent for an existing active super administrator.

## Quality gates

```bash
npm run lint:all
npm test
npm run build:all
npm audit --omit=dev
npm --prefix frontend audit --omit=dev
```

## Production deployment

1. Set `NODE_ENV=production`, use unique random JWT secrets, and provide the
   production PostgreSQL, SMTP, HTTPS frontend, and proxy settings.
2. Keep `DATABASE_SYNCHRONIZE=false`; schema changes must use migrations.
3. Run `npm run migration:run` before starting the new application version.
4. Run `npm run build:all`, serve `frontend/dist` with SPA fallback, and start
   the API with `npm run start:prod`.
5. Route same-origin `/api` and `/uploads` requests to the API. If a trusted
   reverse proxy is immediately in front of the API, set `TRUST_PROXY_HOPS=1`;
   otherwise leave it at `0`.
6. Put `UPLOADS_DIR` on persistent storage. Ephemeral container storage will
   lose uploaded product images during a redeploy.

The included `InitialSchema` migration creates a new empty database. If the
target database already has application tables or data, baseline it before
running this migration rather than applying it blindly.

Health checks:

- `GET /api/v1/health/live` confirms the process is running.
- `GET /api/v1/health/ready` confirms the database is reachable.

Swagger is available at `/docs` outside production only. Detailed internal
errors are hidden in production unless `SHOW_ERROR_DETAILS=true` is deliberately
set for short-lived diagnostics.
