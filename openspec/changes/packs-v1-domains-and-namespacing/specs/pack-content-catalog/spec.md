## MODIFIED Requirements

### Requirement: API exposes a pack content catalog

The system SHALL expose pack-provided content via the API for UI consumption.

#### Scenario: List available packs

- **WHEN** a signed-in user requests packs
- **THEN** the system returns pack metadata for discovered packs, including which content domains each pack provides

#### Scenario: List items across packs

- **WHEN** a signed-in user requests the item catalog
- **THEN** the system returns a list of items aggregated from discovered packs, each with a canonical namespaced id

#### Scenario: Search items across packs

- **WHEN** a signed-in user provides a search query
- **THEN** the system returns only items matching the query

#### Scenario: List kins across packs

- **WHEN** a signed-in user requests the kin catalog
- **THEN** the system returns a list of kins aggregated from discovered packs, each with a canonical namespaced id

#### Scenario: List professions across packs

- **WHEN** a signed-in user requests the profession catalog
- **THEN** the system returns a list of professions aggregated from discovered packs, each with a canonical namespaced id

### Requirement: Pack content is treated as data only

The system SHALL treat pack content as data and SHALL NOT execute arbitrary code from packs.

#### Scenario: Pack load does not execute code

- **WHEN** the system discovers and loads pack content
- **THEN** it parses structured data files only
