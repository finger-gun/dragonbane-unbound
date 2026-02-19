## ADDED Requirements

### Requirement: Character can be created
The system SHALL allow a signed-in user to create a character with core identity fields.

#### Scenario: Create a new character
- **WHEN** a user submits a character name, lineage, and profession
- **THEN** the system creates a character record owned by that user

### Requirement: Character details can be edited
The system SHALL allow a signed-in user to update their character's core fields.

#### Scenario: Update character profile
- **WHEN** a user edits their character name or profession
- **THEN** the system saves the updated values

### Requirement: Derived stats are computed
The system SHALL compute derived stats from base attributes using the rules baseline.

#### Scenario: Derived stats update
- **WHEN** a user changes a base attribute
- **THEN** derived stats are recalculated and displayed

### Requirement: Character sheet displays summary
The system SHALL show a character summary view for quick reference.

#### Scenario: View character sheet
- **WHEN** a user opens a character sheet
- **THEN** the system displays core identity, base attributes, and derived stats
