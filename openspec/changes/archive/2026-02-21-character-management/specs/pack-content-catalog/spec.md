## ADDED Requirements

### Requirement: API exposes a pack content catalog

The system SHALL expose pack-provided content via the API for UI consumption.

#### Scenario: List available packs

- **WHEN** a signed-in user requests packs
- **THEN** the system returns pack metadata for discovered packs

#### Scenario: List items across packs

- **WHEN** a signed-in user requests the item catalog
- **THEN** the system returns a list of items aggregated from discovered packs

#### Scenario: Search items across packs

- **WHEN** a signed-in user provides a search query
- **THEN** the system returns only items matching the query

### Requirement: Pack content is treated as data only

The system SHALL treat pack content as data and SHALL NOT execute arbitrary code from packs.

#### Scenario: Pack load does not execute code

- **WHEN** the system discovers and loads pack content
- **THEN** it parses structured data files only
