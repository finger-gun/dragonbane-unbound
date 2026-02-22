## ADDED Requirements

### Requirement: API serves pack-provided static assets

The system SHALL serve static assets provided by discovered packs over the API.

#### Scenario: Authenticated user requests a pack asset

- **WHEN** an authenticated user requests a pack asset by reference
- **THEN** the API responds with the asset bytes and an appropriate `Content-Type`

### Requirement: Asset resolution supports portraits by kin reference

The system SHALL be able to resolve a kin portrait asset from a kin reference.

#### Scenario: Resolve a kin portrait

- **WHEN** the API is asked to resolve the portrait for a given kin reference
- **THEN** it returns a stable URL that the web UI can use to fetch the image

### Requirement: Missing assets fail safely

The system SHALL fail safely when an asset reference cannot be resolved.

#### Scenario: Requested asset is missing

- **WHEN** an authenticated user requests an asset reference that does not exist
- **THEN** the API responds with a not-found error that does not expose filesystem paths
