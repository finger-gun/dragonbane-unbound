## Context

The project is at initialization and needs a working local-first foundation before feature development. The platform is a Turborepo + pnpm monorepo with apps and packages, and relies on Supabase for local Postgres/Auth/Storage. We must enable a repeatable local dev environment with minimal app shells and shared configuration aligned to repository conventions.

## Goals / Non-Goals

**Goals:**
- Establish the monorepo scaffold with the agreed apps/packages layout.
- Provide minimal web and API app shells wired into the workspace.
- Deliver local Supabase via Docker Compose with documented env conventions.
- Set baseline TypeScript, linting, and formatting config to keep the repo consistent.

**Non-Goals:**
- Implement full feature workflows (rules engine, character builder, encounter runner).
- Ship production-grade deployments or hosted Supabase setup.
- Define detailed domain schemas beyond initial dev plumbing.

## Decisions

- **Use Turborepo + pnpm workspaces.** Matches the manifesto, supports apps/packages separation, and allows fast task orchestration.
  - Alternatives: Nx (heavier setup), Yarn workspaces (less standard here).
- **Start with web + API shells only.** Keeps initial scope small while proving workspace wiring.
  - Alternatives: include mobile/docs apps now (adds complexity early).
- **Local Supabase via Docker Compose.** Aligns with local-first principle and provides a portable dev baseline.
  - Alternatives: local Postgres only (misses Auth/Storage parity), hosted Supabase from day one (conflicts with local-first).
- **Centralize config in shared root files.** Single tsconfig/eslint/prettier baselines reduce divergence early.
  - Alternatives: per-package configs (higher maintenance, inconsistent rules).

## Risks / Trade-offs

- **Docker dependency for local dev** → Provide clear setup docs and allow opting out for contributors who only need frontend work.
- **Minimal shells may be too bare** → Ensure they compile and run a hello page/health route to validate wiring.
- **Future refactors if layout changes** → Keep scope limited to agreed layout from the manifesto to reduce churn.
