## Why

We need a runnable, local-first foundation before feature work can begin, including a repeatable dev environment and baseline repo structure. Establishing this now reduces early churn and lets the team validate assumptions about local Supabase, packaging, and app boundaries.

## What Changes

- Introduce the monorepo scaffold (Turborepo + pnpm) with the agreed apps/packages layout.
- Add baseline app shells (web, api) and shared packages to enable compilation and local dev.
- Provide local Supabase (Docker) setup with configuration and dev scripts.
- Establish base configuration (TypeScript, linting, formatting) aligned with repo conventions.

## Capabilities

### New Capabilities
- `monorepo-scaffold`: Standardized repo layout, tooling, and workspace configuration for apps/packages.
- `base-app-shells`: Minimal web and API app shells wired to the workspace with shared types/utils.
- `local-supabase-dev`: Local Supabase stack with Docker Compose, env setup, and connection conventions.

### Modified Capabilities

## Impact

- Repo structure and workspace tooling (pnpm, Turborepo).
- Local development workflows, environment configuration, and Docker setup.
- Baseline app/package dependencies and shared configuration files.
