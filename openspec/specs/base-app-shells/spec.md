## Purpose

Define the minimum web and API app shells needed to validate the workspace and local development loop.

## Requirements

### Requirement: Web app shell runs locally
The web app SHALL provide a minimal shell that starts locally and renders a basic page.

#### Scenario: Web dev server starts
- **WHEN** a developer runs the web app in dev mode
- **THEN** the app serves a basic page without build errors

### Requirement: API app shell exposes health endpoint
The API app SHALL provide a minimal shell with a health endpoint for local verification.

#### Scenario: API health check
- **WHEN** the health endpoint is requested
- **THEN** the API responds with a success status and a simple payload

### Requirement: Apps can import shared packages
Apps SHALL be able to import types or utilities from shared packages in the workspace.

#### Scenario: Shared import builds
- **WHEN** the web or API app imports a shared type or utility
- **THEN** the app builds successfully using workspace resolution
