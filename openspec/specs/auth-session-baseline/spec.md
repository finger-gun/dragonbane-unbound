## Purpose

Define the baseline authentication and session lifecycle using Supabase Auth, including multi-role users.

## Requirements

### Requirement: Email/password sign-in
The system SHALL allow users to sign in with email and password using Supabase Auth.

#### Scenario: Successful sign-in
- **WHEN** a user submits valid email and password credentials
- **THEN** the system creates a Supabase session for the user

### Requirement: Session lifecycle management
The system SHALL expose login, logout, and session state handling in the web app.

#### Scenario: Logout clears session
- **WHEN** a signed-in user logs out
- **THEN** the client session is cleared and the user is treated as signed out

### Requirement: API JWT verification
The API SHALL validate Supabase JWTs on authenticated endpoints.

#### Scenario: Valid token grants access
- **WHEN** a request includes a valid Supabase access token
- **THEN** the API permits access to protected routes

### Requirement: Multi-role user model
The system SHALL support assigning any combination of roles: admin, player, and game master.

#### Scenario: User has multiple roles
- **WHEN** a user is assigned more than one role
- **THEN** the system recognizes all assigned roles during authorization

### Requirement: Local-first auth defaults
The local development workflow SHALL support Supabase Auth without hosted dependencies.

#### Scenario: Local auth setup succeeds
- **WHEN** a developer runs the local Supabase stack with configured env values
- **THEN** email/password authentication functions against the local instance
