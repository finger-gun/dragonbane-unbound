## ADDED Requirements

### Requirement: Character sheet stores an optional portrait reference

The system SHALL store a character portrait reference on the character sheet, and it SHALL be optional.

#### Scenario: Character includes portrait reference

- **WHEN** a character is stored
- **THEN** the character sheet may include a portrait reference value that can be resolved to an image

### Requirement: New characters default the portrait from kin

The system SHALL set a default portrait reference when a new character is created based on the selected kin.

#### Scenario: Character creation sets default portrait

- **WHEN** a user creates a new character and selects a kin
- **THEN** the persisted character sheet includes a portrait reference derived from that kin

#### Scenario: Portrait cannot be resolved at creation

- **WHEN** a user creates a new character and the system cannot resolve a kin portrait for the selected kin
- **THEN** the portrait reference is stored as null or omitted and the UI uses a placeholder
