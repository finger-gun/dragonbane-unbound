## Purpose

Define listing and browsing of characters owned by a user, with game master visibility rules.

## Requirements

### Requirement: Character library lists a user's characters

The system SHALL allow a signed-in user to view a list of characters they own.

#### Scenario: User views their character list

- **WHEN** a signed-in user navigates to the character library
- **THEN** the system shows a list of characters where `character.user_id` equals the signed-in user's id

#### Scenario: Character list includes identity summary

- **WHEN** the character library is shown
- **THEN** each list entry includes at least: character id, character name, kin, profession, and last updated timestamp

### Requirement: Game master can list all characters

The system SHALL allow a signed-in user with the `game-master` role to view a list of all characters.

#### Scenario: Game master views all characters

- **WHEN** a game master requests the global character list
- **THEN** the system returns characters owned by any user
