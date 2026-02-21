## Purpose

Define adventure (campaign session) creation/joining and associating characters with active/completed state.

## Requirements

### Requirement: Game master can create an adventure session

The system SHALL allow a signed-in user with the `game-master` role to create an adventure session.

#### Scenario: Creating an adventure returns a join mechanism

- **WHEN** a game master creates an adventure session
- **THEN** the system returns an identifier for the adventure and a join mechanism that can be shared with players

### Requirement: Users can join an adventure session

The system SHALL allow a signed-in user to join an adventure session using the provided join mechanism.

#### Scenario: Player joins via join mechanism

- **WHEN** a signed-in user submits a valid join mechanism
- **THEN** the system adds the user as a member of the adventure

### Requirement: Characters can be associated with adventures

The system SHALL allow associating characters to an adventure with an active/completed state.

#### Scenario: Character is marked active in an adventure

- **WHEN** a user associates one of their characters to an adventure
- **THEN** the character is marked active for that adventure

#### Scenario: Character is marked completed in an adventure

- **WHEN** a user marks an associated character as completed for that adventure
- **THEN** the system stores the completed state

### Requirement: Character view shows adventure participation

The system SHALL show which adventures a character is active in and which adventures it has completed.

#### Scenario: Character page shows active/completed adventures

- **WHEN** a character detail page is displayed
- **THEN** the system lists active adventures and completed adventures for that character
