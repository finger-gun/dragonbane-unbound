## Purpose

Define the local Supabase stack and documentation required for a local-first development workflow.

## Requirements

### Requirement: Local Supabase stack is provided
The repository SHALL provide a Docker-based Supabase stack for local development.

#### Scenario: Supabase services start locally
- **WHEN** a developer starts the local Supabase stack
- **THEN** Postgres, Auth, and Storage services become available

### Requirement: Local configuration is documented and repeatable
The repository SHALL define required environment variables and defaults for local Supabase usage.

#### Scenario: Environment setup succeeds
- **WHEN** a developer follows the local setup instructions
- **THEN** the app stack connects to local Supabase without requiring hosted services

### Requirement: Local-first is the default
The development workflow SHALL not require a hosted Supabase project to run locally.

#### Scenario: Hosted dependency not required
- **WHEN** a developer has no hosted Supabase credentials
- **THEN** local development remains functional using the Docker stack
