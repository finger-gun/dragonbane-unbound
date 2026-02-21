## ADDED Requirements

### Requirement: Character conditions can be viewed and updated

The system SHALL allow a signed-in user to view and update a character's conditions.

#### Scenario: User toggles a condition

- **WHEN** a signed-in user toggles a condition on a character they own
- **THEN** the system persists the updated condition state on the character

#### Scenario: Conditions appear on character view

- **WHEN** a character is displayed
- **THEN** the system shows the current condition states for that character
