## Why

The current Supabase Auth integration supports email/password sign-in but provides no way for a new user to create an account. Adding a signup path unblocks onboarding for local development and upcoming user-facing flows that assume self-service account creation.

## What Changes

- Add email/password signup using Supabase Auth.
- Add a web UI flow for signup (form + navigation between sign-in and signup).
- Add password reset / forgot password flow so users can recover access.
- Define expected behavior for signup success/failure (validation, error messaging, and post-signup routing).
- Ensure local-first development supports signup against local Supabase (including a workable email confirmation posture for local dev).

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `auth-session-baseline`: Extend baseline auth to include email/password signup (account creation) alongside sign-in/session lifecycle.

## Impact

- Web app auth pages/components and client auth state handling.
- Supabase Auth configuration for local dev (email confirmation behavior) and related documentation.
- Test coverage for auth flows (TDD for core logic) plus manual verification of signup + reset flows.
