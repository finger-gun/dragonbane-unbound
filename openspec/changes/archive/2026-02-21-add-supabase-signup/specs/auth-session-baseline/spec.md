## ADDED Requirements

### Requirement: Email/password sign-up

The system SHALL allow users to create an account with email and password using Supabase Auth.

#### Scenario: Signup succeeds and signs user in

- **WHEN** a user submits a valid email and password and email confirmation is not required
- **THEN** the system creates the account and establishes an authenticated session for the user

#### Scenario: Signup succeeds but requires email confirmation

- **WHEN** a user submits a valid email and password and email confirmation is required
- **THEN** the system creates the account without an authenticated session and instructs the user to confirm their email before signing in

#### Scenario: Signup fails for existing email

- **WHEN** a user attempts to sign up with an email that is already registered
- **THEN** the system rejects the signup attempt and no authenticated session is created

#### Scenario: Local-first signup does not require an external email provider

- **WHEN** the web app is running against the local Supabase stack
- **THEN** a developer can complete the signup flow without relying on a third-party email delivery provider

### Requirement: Password reset request

The system SHALL allow a user to request a password reset using their email address.

#### Scenario: Reset request is accepted

- **WHEN** a user submits an email address to the "forgot password" form
- **THEN** the system accepts the request and instructs the user to check their email for a reset link

#### Scenario: Reset request does not reveal account existence

- **WHEN** a user submits an email address that is not registered
- **THEN** the system responds with the same user-facing messaging as a registered email and does not create an authenticated session

### Requirement: Password reset completion

The system SHALL allow a user to set a new password via a Supabase Auth password reset link.

#### Scenario: Reset link opens update-password flow

- **WHEN** a user opens a valid password reset link
- **THEN** the web app presents an update-password form that allows setting a new password

#### Scenario: Password update succeeds

- **WHEN** a user submits a valid new password with a valid reset session
- **THEN** the system updates the password and the user can sign in using the new password

#### Scenario: Invalid or expired reset link

- **WHEN** a user opens an invalid or expired password reset link
- **THEN** the web app shows an error and provides a path to request a new reset link

#### Scenario: Local-first reset does not require an external email provider

- **WHEN** the web app is running against the local Supabase stack
- **THEN** a developer can retrieve and follow the reset link without relying on a third-party email delivery provider
