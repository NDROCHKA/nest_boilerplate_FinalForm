# Crusaders Web frontend

React/Vite storefront for the Crusaders Web API. Use the repository root
README for setup and production deployment instructions.

```bash
npm run dev
npm run lint
npm run build
```

API and upload URLs are intentionally relative (`/api/v1` and `/uploads`). The
development server proxies them locally; production must route them to the API.
