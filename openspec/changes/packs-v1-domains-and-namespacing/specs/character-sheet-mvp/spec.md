## MODIFIED Requirements

### Requirement: Character identity fields are captured

The system SHALL capture the core identity fields defined by the character sheet.

#### Scenario: Create character identity

- **WHEN** a user creates a character
- **THEN** the system stores player name, character name, kin, age category, profession, weakness, and appearance
- **AND THEN** the system stores namespaced references for kin and profession when they are pack-defined

### Requirement: Equipment and encumbrance are represented

The system SHALL represent weapons, armor, inventory slots, and encumbrance rules.

#### Scenario: Encumbrance limits

- **WHEN** inventory items are added
- **THEN** used slots are compared to carrying capacity and over-capacity is detectable
- **AND THEN** weapons, armor, and inventory entries MAY store namespaced item references pointing to pack-defined equipment
