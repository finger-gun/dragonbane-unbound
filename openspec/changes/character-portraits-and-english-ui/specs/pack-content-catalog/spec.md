## ADDED Requirements

### Requirement: API supports portrait discovery and resolution

The system SHALL expose a minimal API for the web UI to discover or resolve portraits for kin references.

#### Scenario: UI resolves a kin portrait URL

- **WHEN** an authenticated user requests the portrait for a kin reference
- **THEN** the API returns a URL suitable for use in an `<img>` tag
