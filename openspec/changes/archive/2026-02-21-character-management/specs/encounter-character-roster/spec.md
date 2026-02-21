## ADDED Requirements

### Requirement: Encounters can include characters as participants

The system SHALL allow encounter participants to reference an existing character.

#### Scenario: User selects a character as a participant

- **WHEN** a signed-in user selects one of their characters while creating an encounter
- **THEN** the encounter participant includes a stable `character_id` reference

#### Scenario: Encounter display links participants to character data

- **WHEN** an encounter includes a participant with `character_id`
- **THEN** the encounter UI uses the referenced character for display (at least name) and keeps the link stable

### Requirement: Game master can select from all characters

The system SHALL allow a signed-in user with the `game-master` role to select any character as an encounter participant.

#### Scenario: Game master sees all characters in participant picker

- **WHEN** a game master opens the character picker while creating an encounter
- **THEN** the picker can show characters owned by any user
