## ADDED Requirements

### Requirement: User can edit a character they own

The system SHALL allow a signed-in user to update editable fields on a character they own.

#### Scenario: User saves edits

- **WHEN** a signed-in user updates an editable field on a character they own and saves
- **THEN** the system persists the updated character and the character summary reflects the new values

#### Scenario: User cannot edit another user's character

- **WHEN** a signed-in user attempts to update a character they do not own
- **THEN** the system rejects the request

### Requirement: User can delete a character they own

The system SHALL allow a signed-in user to delete a character they own.

#### Scenario: Deleting a character removes it from the library

- **WHEN** a signed-in user deletes a character they own
- **THEN** the character no longer appears in that user's character library

#### Scenario: Deleting a character makes direct links unavailable

- **WHEN** a signed-in user navigates to a deleted character's page
- **THEN** the system responds as not found
