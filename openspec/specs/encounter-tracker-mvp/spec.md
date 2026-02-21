## Purpose

Define the minimum encounter tracker behavior for turn order and basic combat logging.

## Requirements

### Requirement: Encounter can be created

The system SHALL allow a signed-in user to create an encounter with participants.

#### Scenario: Create encounter

- **WHEN** a user creates a new encounter and adds participants
- **THEN** the system stores the encounter with its participant list

### Requirement: Initiative order is tracked

The system SHALL track initiative order for encounter participants.

#### Scenario: Set initiative order

- **WHEN** a user assigns initiative values
- **THEN** the system orders participants by initiative

### Requirement: Turn progression is supported

The system SHALL allow advancing to the next participant in order.

#### Scenario: Advance turn

- **WHEN** a user clicks next turn
- **THEN** the active participant advances and the current turn is updated

### Requirement: Combat log captures actions

The system SHALL record basic encounter log entries for actions or events.

#### Scenario: Log an action

- **WHEN** a user records an action in an encounter
- **THEN** the system stores a timestamped log entry
