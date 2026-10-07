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

### Render backend and database

The repository includes a `render.yaml` Blueprint that creates the stateful
parts of the production stack in one Render project:

- a paid `0.5c-512mb` Node web service for the NestJS API;
- a paid `0.1c-256mb` PostgreSQL database in the same Frankfurt region; and
- a 1 GB persistent disk mounted at the API's `uploads` directory.

In Render, choose **New > Blueprint**, connect this repository, and select the
repository's `render.yaml`. Render will prompt for values marked `sync: false`.
Use these production values:

- `FRONTEND_DOMAIN`: the final HTTPS frontend origin, with no trailing slash
  (for example, `https://shop.example.com`).
- `MAIL_USER`: the Gmail address used to send transactional email.
- `MAIL_PASSWORD`: a Google App Password, never the normal Gmail password.
- `MAIL_DEFAULT_EMAIL`: normally the same address as `MAIL_USER`.

The Blueprint runs compiled TypeORM migrations before each backend deployment.
It intentionally keeps the database private to Render services. After the first
successful deploy, create the initial administrator with a Render one-off job or
Shell using `npm run seed:admin`, then remove all `SEED_SUPER_ADMIN_*` variables.

`FRONTEND_DOMAIN` must exactly match the public Cloudflare Pages origin so the
browser's CORS requests succeed.

### Cloudflare Pages frontend

Only `frontend/dist` is published by Cloudflare. Backend source, `.env.example`,
tests, local uploads, and other repository files are not publicly served.

Create a Pages project from the same GitHub repository with these settings:

- Production branch: `master` (or the branch you use for production)
- Framework preset: React (Vite)
- Root directory: `frontend`
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variable `VITE_API_URL`: the Render API URL including `/api/v1`
  (for example, `https://crusaders-api.onrender.com/api/v1`)
- Environment variable `NODE_VERSION`: `22.12.0`

The `frontend/public/_headers` file supplies basic security headers. Cloudflare
Pages automatically treats this Vite output as a single-page application as
long as no top-level `404.html` is added.

Health checks:

- `GET /api/v1/health/live` confirms the process is running.
- `GET /api/v1/health/ready` confirms the database is reachable.

Swagger is available at `/docs` outside production only. Detailed internal
errors are hidden in production unless `SHOW_ERROR_DETAILS=true` is deliberately
set for short-lived diagnostics.
