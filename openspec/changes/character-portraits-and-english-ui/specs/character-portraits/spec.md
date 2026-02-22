## ADDED Requirements

### Requirement: Kin portraits are shown during character creation

The system SHALL present a kin portrait visual for each selectable kin during character creation.

#### Scenario: Character creator shows kin portraits

- **WHEN** a signed-in user opens character creation
- **THEN** each kin option includes a portrait image or a safe fallback placeholder

### Requirement: Character portrait defaults to selected kin portrait

The system SHALL assign a default character portrait derived from the selected kin when a character is created.

#### Scenario: Creating a character assigns a default portrait

- **WHEN** a signed-in user creates a character with a selected kin
- **THEN** the stored character data includes a portrait reference corresponding to the selected kin

### Requirement: Character views render stored portraits

The system SHALL render the stored character portrait in character views where identity is shown.

#### Scenario: Character detail view shows portrait

- **WHEN** a signed-in user opens a character detail page
- **THEN** the page displays the character portrait when a portrait reference exists
