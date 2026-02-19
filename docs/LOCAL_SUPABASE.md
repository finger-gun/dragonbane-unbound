![Dragonbane Unbound](../assets/logo.png)

# Local Supabase (Docker)

This project runs Supabase locally via Docker Compose. The local stack provides Postgres, Auth, and Storage services without requiring a hosted project.

## Prerequisites

- Docker Desktop running
- Copy env templates before starting

## Setup

1. Copy the env template to `.env` and fill in values:
   ```bash
   cp .env.example .env
   ```
2. Create app env files if needed:
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   cp apps/api/.env.example apps/api/.env
   ```
3. Generate local keys (recommended):
   ```bash
   openssl rand -base64 32
   ```
   Use the result for `SUPABASE_JWT_SECRET`, then generate anon/service keys with the Supabase CLI or a local JWT helper.

4. Apply the auth roles schema (required for baseline auth):
   ```bash
   psql "postgresql://postgres:<password>@localhost:${SUPABASE_DB_PORT}/postgres" -f supabase/sql/001_user_roles.sql
   ```

5. Seed local users (dev only):
   ```bash
   pnpm supabase:seed-users
   ```

## Start the Stack

```bash
docker compose up -d
```

## URLs

- Supabase API gateway: `http://localhost:${SUPABASE_KONG_PORT}`
- Postgres: `postgresql://postgres:<password>@localhost:${SUPABASE_DB_PORT}/postgres`
- Auth: `http://localhost:9999`
- Storage: `http://localhost:${SUPABASE_STORAGE_PORT}`
- Studio (control panel): `http://localhost:${SUPABASE_STUDIO_PORT}`

## Notes

- The compose file is intended for local development only.
- If you change ports or secrets, update `.env` and app env files accordingly.
