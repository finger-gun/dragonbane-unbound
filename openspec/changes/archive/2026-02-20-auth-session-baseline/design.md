## Context

We are introducing the first auth/session baseline for Dragonbane Unbound. The stack is a local-first Supabase deployment with a Next.js web app and a Node API. We need a minimal, secure integration that supports email/password sign-in and role-based access (admin, player, game master) where a user can hold multiple roles.

## Goals / Non-Goals

**Goals:**
- Implement Supabase Auth email/password in the web app with login/logout and session state.
- Establish server-side verification in the API using Supabase JWTs.
- Model multi-role users (admin/player/game master) with a clear source of truth.
- Keep the local dev setup and verification simple and documented.

**Non-Goals:**
- Social login, magic links, or MFA.
- Organization/team management or complex RBAC policies.
- Production hardening (rate limits, full audit logging) beyond the baseline.

## Decisions

- **Use Supabase Auth (email/password) as the identity provider.**
  - Rationale: aligns with local-first Supabase stack already in use and avoids extra auth infrastructure.
  - Alternatives: third-party IDP (adds complexity, not local-first), custom auth (higher security risk).

- **Store roles in a dedicated profile table in Postgres with array-based roles.**
  - Rationale: supports multi-role users and keeps role changes server-authoritative.
  - Alternatives: JWT custom claims only (harder to update), separate join table (more complex for baseline).

- **API validates Supabase JWTs and enforces roles per route.**
  - Rationale: ensures backend enforcement, not just client-side checks.
  - Alternatives: client-only role checks (insecure).

- **Web app uses Supabase client SDK for session management.**
  - Rationale: standard, supported flow with minimal plumbing.
  - Alternatives: custom session store (unnecessary for baseline).

## Risks / Trade-offs

- **Role drift between JWT and DB** → Fetch roles from DB on API requests and treat JWT roles as hints only.
- **Local secrets leakage** → Keep `.env` local and avoid committing; provide init script for safe defaults.
- **Supabase policy complexity** → Start with minimal RLS and expand once domain tables exist.
