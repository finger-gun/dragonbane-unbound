## Purpose

Define browsing pack-provided items and adding/removing them on a character.

## Requirements

### Requirement: User can browse/search items from packs

The system SHALL allow a signed-in user to browse and search an item catalog sourced from installed packs.

#### Scenario: User browses items

- **WHEN** a signed-in user opens the item picker
- **THEN** the system shows items from available packs

#### Scenario: User searches items

- **WHEN** a signed-in user searches by a text query
- **THEN** the system filters results by matching item name (or translated name)

### Requirement: User can add and remove items on a character

The system SHALL allow a signed-in user to add and remove items on a character they own by selecting from the pack item catalog.

#### Scenario: User adds an item to character inventory

- **WHEN** a signed-in user selects an item from the catalog and adds it to their character
- **THEN** the character sheet inventory/equipment reflects that item and retains a stable reference to the catalog item id

#### Scenario: User removes an item from character inventory

- **WHEN** a signed-in user removes an inventory/equipment item from their character
- **THEN** the character sheet no longer includes that item
