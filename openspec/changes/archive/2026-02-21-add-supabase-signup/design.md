## Context

The repository has a Supabase Auth integration that supports email/password sign-in, logout, and session state, but it does not provide a signup (account creation) path. This blocks onboarding for new users and complicates local development testing of auth-gated flows.

Supabase Auth signup behavior differs depending on whether email confirmation is enabled:

- If confirmation is disabled, `signUp` can return an active session immediately.
- If confirmation is enabled, `signUp` creates a user but does not create a session until the email is confirmed.

The implementation needs to support the local-first stack (local Supabase) and align with the existing web/API auth baseline.

## Goals / Non-Goals

**Goals:**

- Provide an email/password signup UI and client flow in the web app.
- Provide a password reset / forgot password flow so users can recover access.
- Use Supabase Auth as the source of truth for account creation.
- Handle both "session returned" and "email confirmation required" outcomes in a user-friendly way.
- Ensure local development supports a workable signup flow without relying on external email delivery.
- Add automated tests (TDD for core logic) and a manual verification path that can be exercised with agent-browser.

**Non-Goals:**

- Social login (OAuth providers), magic links, MFA.
- Production-grade anti-abuse hardening (captcha, advanced rate limiting) beyond basic guardrails.

## Decisions

- **Add a dedicated signup route/page and link it from the existing sign-in UI.**
  - Rationale: keeps the auth flow explicit and easy to test; avoids overloading the sign-in form.
  - Alternatives: single combined form with mode toggle (more UI branching), modal flow (harder to deep-link/test).

- **Use Supabase client SDK `signUp({ email, password })` for account creation.**
  - Rationale: standard Supabase flow; matches the existing sign-in integration.
  - Alternatives: custom API endpoint that proxies signup (adds complexity, duplicates auth logic).

- **Model post-signup outcome as one of two UI states: signed-in session vs. confirmation-required.**
  - Rationale: Supabase behavior depends on project settings; the UI must not assume a session.
  - Alternatives: require one posture globally (forces infra/config decisions prematurely).

- **Ensure a roles/profile record exists for newly created users via the most server-authoritative mechanism available.**
  - Preferred: database trigger on `auth.users` that inserts a corresponding profile/roles row.
  - Fallback: on first authenticated request, lazily create the profile row if missing.

- **Implement password reset using the Supabase Auth email reset flow.**
  - Add a "forgot password" page that requests a reset email.
  - Add an "update password" page that is opened via the reset link and calls the Supabase SDK to set the new password.
  - Rationale: standard Supabase-supported approach; minimizes backend plumbing.
  - Alternatives: custom API/token reset (higher security surface area).

## Risks / Trade-offs

- **Email confirmation is enabled and local signup cannot complete** -> Provide local guidance to use auto-confirm or local email UI; add a confirmation-required UI state.
- **User enumeration via error messages** -> Normalize user-facing copy for signup failures where feasible; rely on Supabase error semantics.
- **Profile/roles row not created on signup** -> Add/verify trigger or lazy-create logic; cover with tests.
- **Reset email delivery differs between local and hosted** -> Ensure local dev guidance covers how to access the reset link (local email UI/logs) without third-party email.

## Migration Plan

- No breaking changes expected.
- If a DB trigger/migration is required for profile creation, ship it as part of the change and verify it works against local Supabase.
- Update local dev docs (if needed) to describe the expected email confirmation posture for local signup verification.

## Open Questions

- Should production require email confirmation by default, or can we defer this decision and only guarantee local auto-confirm?
- Should new users receive a default role (e.g., `player`) on signup, or start with no roles until assigned?
