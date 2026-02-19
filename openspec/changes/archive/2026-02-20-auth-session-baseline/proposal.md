## Why

We need a minimal authentication and session baseline to unblock user-facing flows and to validate the Supabase-backed local-first stack. Supabase Auth is the chosen identity provider, so we should establish the integration now before feature work deepens.

## What Changes

- Add Supabase Auth-based authentication with email/password sign-in.
- Establish session handling in web and API (login, logout, session state).
- Introduce role assignment for admin, player, and game master (multi-role per user).
- Provide local-first defaults and documentation for running auth against local Supabase.

## Capabilities

### New Capabilities
- `auth-session-baseline`: Supabase Auth-backed auth, session lifecycle, and role assignment for admin/player/game-master.

### Modified Capabilities
- (none)

## Impact

- Web app auth UI and session state management.
- API auth middleware/guards and role checks.
- Supabase auth configuration and environment variables.
- Developer setup and verification workflows for local auth.
