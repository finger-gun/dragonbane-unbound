![Dragonbane Unbound](../assets/logo.png)

# Development Guidelines

## Document as You Build

Any time you add a new tool, workflow, or capability, update `docs/` in the same change. Treat documentation as part of the implementation, not a follow-up. If a change affects local setup, scripts, or developer ergonomics, update the relevant doc or add a new one.

## Repo Conventions

- Keep changes local-first and self-hostable.
- Apps depend on packages; packages avoid depending on apps.
- Use shared root configs for TypeScript, linting, and formatting.

## Core Scripts

Run these from the repo root:

- `pnpm dev`: runs all dev targets in parallel
- `pnpm dev:full`: starts local Supabase (Docker) and runs all dev targets in parallel
- `pnpm supabase:up`: starts local Supabase (Docker)
- `pnpm supabase:down`: stops local Supabase (Docker)
- `pnpm test`: runs all test targets
- `pnpm lint`: runs all lint targets

Ports should be configurable via environment variables. Defaults live in each app's `.env.example`.
Local Supabase requires a root `.env` (see `.env.example`) and Docker running.

## Getting Started (Local Dev)

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Create your root env file:
   ```bash
   cp .env.example .env
   ```
3. Fill in required values in `.env`:
   - `SUPABASE_DB_USER=postgres`
   - `SUPABASE_DB_PASSWORD=postgres`
   - `SUPABASE_DB_NAME=postgres`
   - `SUPABASE_JWT_SECRET=` (32+ chars)
4. Optional: set app ports in `apps/web/.env.example` and `apps/api/.env.example`.
5. Start local Supabase (Docker):
   ```bash
   pnpm supabase:up
   ```
6. Start the apps:
   ```bash
   pnpm dev
   ```
