# Atelier

An editorial ecommerce homepage using Next.js App Router, TypeScript, Tailwind CSS v4, Better Auth, and Neon PostgreSQL integration wiring. Uses npm and Node.js 22.18 or later.

## Local setup

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env.local`.
3. Set `DATABASE_URL` to your Neon's pooled PostgreSQL connection URL (the hostname contains `-pooler`). Preserve TLS; the example uses `sslmode=verify-full`.
4. Generate a secret with `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"` and set `BETTER_AUTH_SECRET` to the result.
5. Keep `BETTER_AUTH_URL=http://localhost:3000` for local development.
6. Run `npm run dev`.

The homepage works without credentials and uses four sample products from `src/lib/products.ts`. It includes responsive collections, category filtering, local search, accessible product previews, and saved pieces held in page memory. Reloading clears saved pieces. No purchases are processed. Auth requests require the environment values above.

## Commands

- `npm run dev`: start the development server.
- `npm run build`: create a production build.
- `npm start`: serve an existing production build.
- `npm run lint`: run ESLint.
- `npm run typecheck`: generate Next.js route types and check TypeScript.

## Structure

```text
src/
  app/
    api/auth/[...all]/route.ts  Better Auth GET/POST handler (Node.js runtime)
    globals.css               Tailwind CSS entry point
    layout.tsx                Root document and metadata
    page.tsx                  Homepage with sample catalogue data
  lib/
    auth.ts                   Lazy Better Auth server configuration
    auth-client.ts            Same-origin Better Auth React client
    db.ts                     Shared PostgreSQL pool for Neon
    env.ts                    Required server environment values
```

Next.js, TypeScript, ESLint, and Tailwind/PostCSS configuration live at the project root. The `@/*` import alias resolves to `src/*`. Database and server auth modules are marked server-only.

## Integration boundaries

Neon is accessed through the standard `pg` driver, which Better Auth supports directly. `getDatabase()` exposes the shared pool; `getAuth()` exposes the configured auth instance. No ORM is required for this initial wiring. No database is provisioned or contacted during setup or build.

No schemas or migrations have been created or run, including Better Auth's required tables. Database-backed auth operations will require those tables in a later phase. No sign-in method, OAuth provider, auth UI, route protection, or complete authentication flow is enabled.

The homepage is a visual catalogue preview. There is no database-backed catalogue, cart, checkout, payment flow, or deployment configuration. Images from Unsplash and Pexels are stored locally and optimized with Next Image; see `docs/image-sources.md` for credits and `docs/design-system.md` for the design foundations.

References: [Better Auth PostgreSQL](https://better-auth.com/docs/adapters/postgresql), [Better Auth Next.js integration](https://better-auth.com/docs/integrations/next), and [Neon connection strings](https://neon.com/docs/connect/connect-from-any-app).


### Sample catalogue

- `/new-arrivals` provides category, availability and text filters plus price sorting. Filters use URL query parameters and can be shared or restored with browser navigation.
- `/products/[slug]` provides a dedicated detail page, large imagery with an accessible enlargement dialog, price, category, color and derived stock state. Unknown slugs show a 404.
- The homepage and catalogue reuse `ProductCard`, the storefront shell and the existing design tokens. Product fixtures remain in `src/lib/products.ts`; stock labels derive from quantity and made-to-order in `src/lib/stock.ts`.
- Products, prices and availability are samples. No checkout, new database schema or purchase flow is included.
