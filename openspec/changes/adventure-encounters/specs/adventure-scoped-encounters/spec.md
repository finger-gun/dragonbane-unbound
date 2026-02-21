## ADDED Requirements

### Requirement: Encounters can be created within an adventure

The system SHALL allow an adventure member to create an encounter that is associated with the adventure.

#### Scenario: Create encounter from adventure context

- **WHEN** a signed-in user who is a member of an adventure creates a new encounter with that `adventure_id`
- **THEN** the system creates the encounter and associates it to the adventure

#### Scenario: Non-member cannot create adventure encounter

- **WHEN** a signed-in user who is not a member of an adventure attempts to create an encounter with that `adventure_id`
- **THEN** the system rejects the request

### Requirement: Encounters can be listed by adventure

The system SHALL allow an adventure member to list encounters associated with an adventure.

#### Scenario: List encounters in adventure detail

- **WHEN** a signed-in adventure member views an adventure detail
- **THEN** the system displays the encounters associated with the adventure ordered by most recently updated

#### Scenario: Non-member cannot list adventure encounters

- **WHEN** a signed-in user who is not a member requests the encounters for an adventure
- **THEN** the system rejects the request

### Requirement: Encounters in an adventure are visible to all members

The system SHALL make adventure-scoped encounters visible to all adventure members.

#### Scenario: Player can open encounter created by another member

- **WHEN** an adventure member opens an encounter associated with that adventure
- **THEN** the system allows access even if another member created the encounter
